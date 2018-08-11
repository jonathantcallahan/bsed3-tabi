const path = require('path')

module.exports = app => {
    app.get('/', (req,res) => {
        res.sendFile(path.join(__dirname, './../public/html/index.html'))
    })
    app.get('/drag', (req,res) => {
        res.sendFile(path.join(__dirname, './../public/html/drag.html'))
    })
    app.get('/staging', (req,res) => {
        res.sendFile(path.join(__dirname, './../public/html/staging.html'))
    })
}