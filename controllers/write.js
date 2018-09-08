const config = require('../.config.json')

const write = (request, response) => {
    if (request.query.username === config.username
        && request.query.password === config.password)
        response.sendFile(path.join(process.cwd(), 'static', 'tools', 'web', 'index.html'))
    else
        response.sendStatus(403)
}

module.exports = write