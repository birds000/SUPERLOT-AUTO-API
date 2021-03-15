const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { LoginRefresh } = require('../scb/login');

routes.post(`${API_V1}/scb/login/refresh`, async (req, res) => {
    const res_login = await LoginRefresh();
    if (res_login.status.code == "1000") {
        console.log(res_login.data.access_token)
        res.json({ status: true })
    } else { // error LOGIN
        console.log("error LOGIN")
        res.json(error)
    }
})