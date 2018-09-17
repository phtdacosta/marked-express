const path = require('path')

const express = require('express')

const router = require('./routers/router'),
    { port
    , host
    , url } = require('./.config.json')

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

app.listen(port, host, () => {
    console.log(':%d\n%s\n%s/', port, host, url)
})