const path = require('path')

const Drapid = require('drapid')

const initialize = () => {
    const standard = new Drapid.Standard({'path': path.join(process.cwd(), 'articles.json'), 'key':'label'})
    standard.loadSync()
    return standard
}

module.exports = initialize()