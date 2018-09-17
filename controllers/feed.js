const path = require('path')

const database = require('../utilities/functions/database'),
    renderFeed = require('../utilities/functions/helpers').renderFeed
    renderEngine = require('../utilities/functions/helpers').renderEngine

const renderPhase = async function () {
    const feed = await renderFeed(
        database.data,
        path.join(process.cwd(), 'templates', 'frame.html'))
    const head = await renderEngine(
        {
            'title': 'marked-express'
        },
        path.join(process.cwd(), 'templates', 'head.html'))
    const body = await renderEngine(
        {
            'feed': feed.join('<br>')
        },
        path.join(process.cwd(), 'templates', 'body.html'))
    const page = await renderEngine(
        {
            'head': head,
            'body': body
        },
        path.join(process.cwd(), 'templates', 'base.html'))
    return page
}

const feed = (request, response) => {
    renderPhase()
    .then((page) => {
        response.writeHeader(200, {'Content-Type': 'text/html'})
        response.write(page)
        response.end()
    })
    .catch((error) => {
        console.log(error)
        response.sendStatus(500)
    })
}

module.exports = feed