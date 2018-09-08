const secureString = require('../functions/helpers').secureString

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

module.exports = Article