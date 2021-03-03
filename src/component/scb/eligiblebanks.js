const routes = require('express').Router();
const request = require('request');
const conn = require('../../util/connectDB');

const { SCB_API, API_REFRESH, DEVICEID } = require('../../util/connectSCB');

function eligiblebanks(apiAuth) {
    var options = {
        'method': 'GET',
        'url': `${SCB_API}/v1/transfer/eligiblebanks`,
        'headers': {
            'Accept-Language': 'th',
            'Api-Auth': apiAuth
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const result = JSON.parse(body);
        return result
    });
}

module.exports = routes;