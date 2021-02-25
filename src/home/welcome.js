const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.send('Welcome To API Ruay')
})

routes.get('/param/:param', (req, res) => {
    res.send('Welcome To API Ruay' + req.params.param)
})

module.exports = routes;