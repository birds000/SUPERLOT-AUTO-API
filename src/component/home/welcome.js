const routes = require('express').Router();
const { testV1, testV2, testAxios, testDB } = require('./funcR');
const { loginRefresh } = require('../scb/login');
const { API_V1 } = require('../../util/config')

routes.get(`${API_V1}/`, async (req, res) => {
    // console.log(testAxios())
    // const data = await loginRefresh();
    // res.json({ result: data })

    res.send('Welcome To API Ruay : ')
})

routes.get(`${API_V1}/param/:param`, (req, res) => {
    res.send('Welcome To API Ruay' + req.params.param)
})

routes.get(`${API_V1}/bank/all/callbank`, (req, res) => {
    testDB(function (err, data) {
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
            res.json({ result: err })
        } else {
            // code to execute on data retrieval
            console.log("result from db is : ", data);
            res.json({ result: data })
        }
    });
})

module.exports = routes;