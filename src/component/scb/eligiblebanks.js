const routes = require('express').Router();
const request = require('request');
const conn = require('../../util/connectDB');

const { SCB_API, API_REFRESH, DEVICEID } = require('../../util/connectSCB');

function eligiblebanks() {
    var options = {
        'method': 'GET',
        'url': `${SCB_API}/v1/transfer/eligiblebanks`,
        'headers': {
            'Accept-Language': 'th',
            'Api-Auth': API_AUTH
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const result = JSON.parse(body);
        return result
    });
}

routes.get('/scb/transfer/eligiblebanks', (req, res) => {
    var body = JSON.stringify({ "deviceId": "35f37d36-b091-483e-95d4-1c4c7bbbc9fc" })
    request.post({
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH
        },
        body
    }, (err, respon, body) => {
        if (err) throw new Error(err);
        var result = JSON.parse(body);
        var accoutToken = result.data.access_token
        console.log(accoutToken)
        request.get({
            url: `${SCB_API}/v1/transfer/eligiblebanks`,
            headers: {
                'Accept-Language': 'th',
                'Api-Auth': accoutToken,
            }
        }, (err, respon, body) => {
            if (err) throw new Error(err);
            const result = JSON.parse(body);
            res.json({ result });
            // console.log(result)
            // return result
        });
    });
})

routes.get('/scb/update/eligiblebanks', (req, res) => {
    var body = JSON.stringify({ "deviceId": "35f37d36-b091-483e-95d4-1c4c7bbbc9fc" })
    request.post({
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH
        },
        body
    }, (err, respon, body) => {
        if (err) throw new Error(err);
        var result = JSON.parse(body);
        var accoutToken = result.data.access_token
        console.log(accoutToken)
        request.get({
            url: `${SCB_API}/v1/transfer/eligiblebanks`,
            headers: {
                'Accept-Language': 'th',
                'Api-Auth': accoutToken,
            }
        }, (err, respon, body) => {
            if (err) throw new Error(err);
            const result = JSON.parse(body);
            const data = result.data
            // res.json({ result });
            // console.log(result)
            // return result
            data.forEach((item) => {
                var bank_name_en = item.bankNameEn;
                var bank_name_th = item.bankNameTh;
                var bank_code = item.bankCode;
                var sql = `UPDATE tb_bank SET bank_name_th = ?, bank_name_en = ? WHERE bank_id = ?`;
                conn.query(sql, [bank_name_th, bank_name_en, bank_code], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.json({ status: "fail", massage: err })
                    }
                })
            });
            res.json({ status: "success", result })
        });
    });
})

routes.get('/scb/add/eligiblebanks', (req, res) => {
    var body = JSON.stringify({ "deviceId": "35f37d36-b091-483e-95d4-1c4c7bbbc9fc" })
    request.post({
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH
        },
        body
    }, (err, respon, body) => {
        if (err) throw new Error(err);
        var result = JSON.parse(body);
        var accoutToken = result.data.access_token
        console.log(accoutToken)
        request.get({
            url: `${SCB_API}/v1/transfer/eligiblebanks`,
            headers: {
                'Accept-Language': 'th',
                'Api-Auth': accoutToken,
            }
        }, (err, respon, body) => {
            if (err) throw new Error(err);
            const result = JSON.parse(body);
            const data = result.data
            // res.json({ result });
            // console.log(result)
            // return result
            data.forEach((item) => {
                var bank_name_en = item.bankNameEn;
                var bank_name_th = item.bankNameTh;
                var bank_code = item.bankCode;
                var sql = `INSERT INTO tb_bank(bank_id, bank_name_en, bank_name_th) VALUES (?, ?, ?)`;
                conn.query(sql, [bank_code, bank_name_en, bank_name_th], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.json({ status: "fail", massage: err })
                    }
                })
            })
            res.json({ status: "success", result })
        });
    });


})


module.exports = routes;