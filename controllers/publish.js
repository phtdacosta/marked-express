const database = require('../utilities/functions/database')({'path': path.join(process.cwd(), 'articles.json'), 'key':'label'}),
    parser = require('../utilities/functions/helpers').parser
    Article = require('../utilities/classes/article')

const publish = (request, response) => {
    parser(request)
    .then(body => {
        const article = new Article(body.timestamp, body.label, body.content)
        // Create a new entry in the database
        database.include(article)
        .then(done => {
            database.persistSync()
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

module.exports = publish