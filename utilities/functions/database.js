const Drapid = require('drapid')

const initialize = (options) => {
    const standard = new Drapid.Standard(options)
    standard.loadSync()
    return standard
}

module.exports = initialize