const routes = require('express').Router();
const { API_V1 } = require('../../util/config');
const { GetMember } = require('../superlot/user');

routes.get(`${API_V1}/test/superlot`, async (req, res) => {
    const member = await GetMember('E22RD8185')
    res.json(member)
})

module.exports = routes;