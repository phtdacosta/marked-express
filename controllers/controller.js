
const fs = require('fs'),
    path = require('path'),
    { parse } = require('querystring'),
    config = require('../.config.json')

const marked = require('marked'),
    Drapid = require('drapid')

const db = new Drapid.Standard({'path':'articles.json', 'key':'label'})
console.log('Loading "' + db.path + '"')
db.loadSync()
console.log(db.data.length + ' loaded entries')

// const inArgv = (str) => {
//     for (const arg of process.argv) {
//         if (arg == str) return true
//     }
//     return false
// }

const parser = (request) => {
    return new Promise((resolve, reject) => {
        const FORM_URLENCODED = 'application/x-www-form-urlencoded'
        if (request.headers['content-type'] !== FORM_URLENCODED) {
            const error = new Error(request.headers['content-type'] + " header value not allowed")
            reject(error)
        } else {
            const chunks = new Array()
            request.on('error', error => {
                reject(error)
            }).on('data', chunk => {
                chunks.push(chunk)
            }).on('end', () => {
                const body = Buffer.concat(chunks).toString()
                resolve(parse(body))
            })
        }    
    })
}

const replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace)
}

const renderEngine = (object, template) => {
    return new Promise((resolve, reject) => {
        fs.readFile(template, 'utf8', (error, data) => {
            if (error) {
                reject(error)
            } else {
                for (const [key, value] of Object.entries(object)) {
                    const parsedKey = '{{ ' + key + ' }}'
                    data = replaceAll(data, parsedKey, value)
                }
                resolve(data)
            }
        })
    })
}

const renderFeed = async function (objects, template) {
    const feed = new Array()
    for (const { timestamp, label } of objects) {
        const entry = await renderEngine(
            { 'time': new Date(timestamp * 1000).toUTCString(), 'label': parseHyperlink(label) },
            template)
        feed.push(entry)
    }
    return feed
}

const secureString = (str) => {
    return str
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

const parseHyperlink = (label) => {
    return '<a href=\"'
    // + req.protocol 
    // + '://'
    + config.url
    // + req.hostname
    + '/'
    + secureString(label)
    + '\">'
    + label
    + '</a>'
}

class Article {
    constructor (timestamp, label, content) {
        (timestamp === undefined || timestamp === null)
            ? this.timestamp = parseInt(Date.now()/1000)
            : this.timestamp = timestamp
        this.label = label
        this.content = content
        this.alias = secureString(label)
    }
}

const write = (request, response) => {
    if (request.query.username === config.username
        && request.query.password === config.password)
        response.sendFile(path.join(process.cwd(), 'static', 'tools', 'web', 'index.html'))
    else
        response.sendStatus(403)
}

const publish = (request, response) => {
    parser(request)
    .then(body => {
        const article = new Article(body.timestamp, body.label, body.content)
        // Create a new entry in the database
        db.include(article)
        .then(done => {
            db.persistSync()
            response.sendStatus(200)
        })
        .catch(error => {
            console.log(error)
            response.sendStatus(500)
        })
    })
    .catch(error => {
        console.log(error)
        response.sendStatus(500)
    })
}

const feed = (request, response) => {
    renderFeed(
        db.data.reverse(),
        path.join(process.cwd(), 'static', 'templates', 'frame.html'))
    .then((feed) => {
        renderEngine(
            {'feed': feed.join('<br>')},
            path.join(process.cwd(), 'static', 'templates', 'main.html'))
        .then((page) => {
            response.writeHeader(200, {'Content-Type': 'text/html'})
            response.write(page)
            response.end()
        }).catch((error) => {
            console.log(error)
            response.sendStatus(500)
        })
    })
    .catch((error) => {
        console.log(error)
        response.sendStatus(500)
    })
}

const retrieve = (request, response) => {
    const alias = request.params.alias
    // Search for the requested data in the database and loads the object if exists
    const article = db.recover('alias', alias)[0]
    if (article === undefined || article === null)
        response.sendStatus(404)
    else {
        // Compiles the content of the file to a specific format using a specialized function
        marked(article.content, (error, markdown) => {
            if (error)
                response.sendStatus(500)
            else {
                // After successfully compiling the file content, the formatted data is inserted into a proper template
                renderEngine(
                    {'time': new Date(article.timestamp * 1000).toUTCString(), 'content': markdown},
                    path.join(process.cwd(), 'static', 'templates', 'article.html'))
                .then(page => {
                    response.writeHeader(200, {'Content-Type': 'text/html'})
                    response.write(page)
                    response.end()
                })
                .catch(error => {
                    console.log(error)
                    response.sendStatus(500)
                })
            }
        })
    }
}

module.exports = {
write: write,
publish: publish,
feed: feed,
retrieve: retrieve
}