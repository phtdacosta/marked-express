const fs = require('fs'),
    { parse } = require('querystring'),
    config = require('../../.config.json')

const isIterable = (object) => {
  if (object == null)
    return false
  return typeof object[Symbol.iterator] === 'function'
}

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

const readFilePromise = (path, type) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, type, (error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
      })
    })
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
    if (isIterable(objects)) {
        for (const { timestamp, label } of objects) {
            const entry = await renderEngine(
                { 'time': new Date(timestamp * 1000).toUTCString(), 'label': parseHyperlink(label) },
                template)
            feed.push(entry)
        }
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
    // + req.hostname
    + '/'
    + secureString(label)
    + '\">'
    + label
    + '</a>'
}

module.exports = {
    parser: parser,
    replaceAll: replaceAll,
    readFilePromise: readFilePromise,
    renderEngine: renderEngine,
    renderFeed: renderFeed,
    secureString: secureString,
    parseHyperlink: parseHyperlink
}