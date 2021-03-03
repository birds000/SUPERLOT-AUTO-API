// const routes = require('express').Router();
// const request = require('request');
const axios = require('axios');
const { SCB_API, API_REFRESH, DEVICEID } = require('../../util/connectSCB');

async function loginRefresh() {
    var data = JSON.stringify({ "deviceId": DEVICEID });
    var config = {
        method: 'post',
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        // console.log(JSON.stringify(response.data));
        const result = JSON.stringify(response.data);
        return result

    } catch (error) {
        // console.error(error);
        return error
    }
}

module.exports = { loginRefresh };