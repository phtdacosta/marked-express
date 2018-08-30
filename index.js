const express = require('express')
const router = require('./routers/router'),
    confs = require('./settings.json')

const app = express()

// const dir = path.join(__dirname, 'static')
// app.use(express.static(dir))
app.use(router)
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.sendStatus(500)
})

server.listen(confs.port, confs.host, () => {
    console.log(':%d\n%s\n%s/', confs.port, confs.host, confs.url)
})