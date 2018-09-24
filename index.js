const fs = require('fs'),
    path = require('path'),
    http = require('http'),
    https = require('https')    

const express = require('express')

const router = require('./routers/router'),
    { hostname
    , protocol
    , preferences
    , domain } = require('./.config.json')

const app = express()

// Last barricade against wandering errors
const catcher = (err, req, res, next) => {
    console.log(err.stack)
    res.sendStatus(500)
}

// Exposes the folder publicly to serve purely static files
const dir = path.join(__dirname, 'static')
app.use('/static', express.static(dir))

app.use(router)
app.use(catcher)

// Loads the certificates
const key = fs.readFileSync(protocol.https.key, 'utf8');
const cert = fs.readFileSync(protocol.https.cert, 'utf8');

const credentials = {
	key: key,
	cert: cert
}

// Starts http and https servers
const init = () => {
    const server = new Object()
    for (const element of preferences.applayer) {
        switch (element) {
            case 'http':
                server['http'] = http.createServer(app)
                break
            case 'https':
                server['https'] = https.createServer(credentials, app)
                break
        }
    }
    return server
}

(() => {
    const server = init()
    console.log('%s\n%s', domain, hostname[preferences.netlayer])
    for (property in server) {
        switch (property) {
            case 'http':
                server[property].listen(
                    protocol.http.port,
                    hostname[preferences.netlayer],
                    () => {
                    console.log(
                        ':%d',
                        protocol.http.port)
                })
                break
            case 'https':
                server[property].listen(
                    protocol.https.port,
                    hostname[preferences.netlayer],
                    () => {
                    console.log(
                        ':%d',
                        protocol.https.port)
                })
                break
        }
    }
})();