const path = require('path'),
    marked = require('marked')

const database = require('../utilities/functions/database'),
    renderEngine = require('../utilities/functions/helpers').renderEngine

const renderPhase = async function (article, markdown) {
    const head = await renderEngine(
        {
            'title': article.label
        },
        path.join(process.cwd(), 'templates', 'head.html'))
    const body = await renderEngine(
        {
            'time': new Date(article.timestamp * 1000).toUTCString(),
            'content': markdown
        },
        path.join(process.cwd(), 'templates', 'article.html'))
    const page = await renderEngine(
        {
            'head': head,
            'body': body
        },
        path.join(process.cwd(), 'templates', 'base.html'))
    return page
}

const retrieve = (request, response) => {
    const alias = request.params.alias
    // Search for the requested data in the database and loads the object if exists
    const article = database.recover('alias', alias)[0]
    if (article === undefined || article === null)
        response.sendStatus(404)
    else {
        // Compiles the content of the file to a specific format using a specialized function
        marked(article.content, (error, markdown) => {
            if (error)
                response.sendStatus(500)
            else {
                // After successfully compiling the file content, the formatted data is inserted into a proper template
                renderPhase(article, markdown)
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

module.exports = retrieve