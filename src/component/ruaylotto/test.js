const routes = require('express').Router();
const axios = require('axios');
const request = require('request');
const qs = require('qs');
const cheerio = require('cheerio')
const { API_V1 } = require('../../util/config');
const { RUAYLOTTO_API } = require('../../util/connectRuaylotto');

routes.get(`/api/v1/test/ruaylotto`, async (req, res) => {
    var options = {
        'method': 'POST',
        'url': 'https://agent.ruaylotty.com/agent/login',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://agent.ruaylotty.com/',
            'Connection': 'keep-alive',
            'Referer': 'https://agent.ruaylotty.com/login',
            'Cookie': '__cfduid=d8b39dc9f580a6d984ef5ddff309030941616768075; _csrf-backend=db91262a6fd5a4ff172623992e34dbd40337d110016f5e5817876014f46b0e04a%3A2%3A%7Bi%3A0%3Bs%3A13%3A%22_csrf-backend%22%3Bi%3A1%3Bs%3A32%3A%22tG9YZmtIkKvI2uefh1XnlTaxauXaXdwD%22%3B%7D; advanced-backend=c927152deb066ff5aaf12444703ee159;',
            'TE': 'Trailers'
        },
        form: {
            '_csrf-backend': 'HO7zSJbbUTb_c2uKMqwg4X24WweG93_0OXfgNJWtechoqcoRzLYlf5Q4HcMA2UWHFYkDaeqjHoxYArhVzckOjA==',
            'LoginForm[username]': 'RUA151',
            'LoginForm[password]': '123123'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(res.json({ error }));
        console.log(response);
        res.json({ result: response })
    });

    // axios(config)
    //     .then(function (response) {
    //         console.log(response)
    //         let cfduid = response.headers['set-cookie'][0].split(" ")[0]
    //         let csrf_backend = response.headers['set-cookie'][1].split(" ")[0]
    //         let $ = cheerio.load(response.data)
    //         let csrf_token = $('meta[name="csrf-token"]').attr('content')
    //         console.log(cfduid)
    //         console.log(csrf_backend)
    //         console.log(csrf_token)
    //         res.json({ result: response.data })
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //         res.json({ error })
    //     });
})

module.exports = routes;