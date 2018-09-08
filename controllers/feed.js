const path = require('path')

const database = require('../utilities/functions/database'),
    renderFeed = require('../utilities/functions/helpers').renderFeed
    renderEngine = require('../utilities/functions/helpers').renderEngine

const feed = (request, response) => {
    renderFeed(
        database.data,
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

module.exports = feed