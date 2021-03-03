const routes = require('express').Router();
const request = require('request');

const SCB_API = 'https://fasteasy.scbeasy.com:8443';
const API_REFRESH = '3ac591e5-c9e3-4ef5-8919-051050dae116';
const API_AUTH = '8d59bebe-6baf-4396-9fb4-2de88b621c19';
const DEVICEID = '35f37d36-b091-483e-95d4-1c4c7bbbc9fc' //รหัสธาคาร ระบุตัวตน

// ข้อมูลบัญชี
const ACCOUNT_FROM = "4094138047" // กำนหด บัญชีผู้โอน (เรา)
const ACCOUNT_FROMTYPE = "2" // กำหนด ประเภทบัญชีผู้โอน (เรา)
const TRANSFER_TYPE = "ORFT" // ประเภทการโอนเงิน 

routes.post('/scb/login/refresh', (req, res) => {
    var body = JSON.stringify({ "deviceId": DEVICEID })
    request.post({
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH
        },
        body
    }, (err, respon) => {
        if (err) throw new Error(err);
        var result = JSON.parse(respon.body);
        res.json({ result });
    });
})

routes.post('/scb/transfer/verification', (req, res) => {
    // var body = JSON.stringify({ "deviceId": DEVICEID })
    request.post({
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH
        },
        body: {
            "deviceId": DEVICEID
        }
    }, (err, respon, body) => {
        if (err) throw new Error(err);
        const result = JSON.parse(body);
        const accoutToken = result.data.access_token
        // console.log(accoutToken)

        var options = {
            'method': 'POST',
            'url': `${SCB_API}/v2/transfer/verification`,
            'headers': {
                'Accept-Language': 'th',
                'Api-Auth': accoutToken,
                'Content-Type': 'application/json',
                // 'Cookie': 'TS0130295e=01339ac5687b2f4646c5b5d0b6ee4d5f39656723cfff1ef6787ac7020dc8ae2c0227437d5cf158b094a71a5bf02798b31a43449a81; TS01fb156f=01339ac5686996c2d1fc5d9e107b26fe4abb87d3eb0fc187b09fa74190ddcc438b6630aeeab69bbaeea954b2b20117592c5b3e3e5a; TS01700433=012a0826e3aab0ffffecfe8e7524673eabf8967b915ce3394f9795c83a44c6b3fbc7b20485090449f1e8e7c85dc183ea2cf3480fdf'
            },
            body: JSON.stringify({
                "accountFrom": "4094138047",
                "accountFromType": "2",
                "accountTo": "6300156178",
                "accountToBankCode": "002",
                "amount": "1.00",
                "annotation": null,
                "transferType": "ORFT"
            })
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            const result = JSON.parse(body);
            res.json({ result });
        });
    });
})

routes.post('/scb/transfer/confirmation', (req, res) => {
    // var body = JSON.stringify({ "deviceId": DEVICEID })
    request.post({
        url: `${SCB_API}/v1/login/refresh`,
        headers: {
            'Accept-Language': 'th',
            'Api-Refresh': API_REFRESH
        },
        body: {
            "deviceId": DEVICEID
        }
    }, (err, respon, body) => {
        if (err) throw new Error(err);
        const result = JSON.parse(body);
        const accoutToken = result.data.access_token
        // console.log(accoutToken)

        var options = {
            'method': 'POST',
            'url': `${SCB_API}/v2/transfer/verification`,
            'headers': {
                'Accept-Language': 'th',
                'Api-Auth': accoutToken,
                'Content-Type': 'application/json',
                // 'Cookie': 'TS0130295e=01339ac5687b2f4646c5b5d0b6ee4d5f39656723cfff1ef6787ac7020dc8ae2c0227437d5cf158b094a71a5bf02798b31a43449a81; TS01fb156f=01339ac5686996c2d1fc5d9e107b26fe4abb87d3eb0fc187b09fa74190ddcc438b6630aeeab69bbaeea954b2b20117592c5b3e3e5a; TS01700433=012a0826e3aab0ffffecfe8e7524673eabf8967b915ce3394f9795c83a44c6b3fbc7b20485090449f1e8e7c85dc183ea2cf3480fdf'
            },
            body: JSON.stringify({
                "accountFrom": ACCOUNT_FROM, // กำนหด บัญชีผู้โอน (เรา)
                "accountFromType": ACCOUNT_FROMTYPE, // กำหนด ประเภทบัญชีผู้โอน (เรา)
                "accountTo": "6300156178", // รับค่ามา บัญชีผู้รับเงิน (สมาชิก)
                "accountToBankCode": "002", // รับค่ามา รหัสธนาคาร (สมาชิก)
                "amount": "1.00", // รับค่ามา จำนวนเงิน
                "annotation": null,
                "transferType": TRANSFER_TYPE // กำหนด รูปแบบการโอนเงิน 
            })
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const result = JSON.parse(body);

            // สำเร็จ code 1000
            if (result.status.code == 1000) {
                const data = result.data;
                var body = JSON.stringify({
                    "accountFrom": "4094138047", // กำนหด บัญชีที่โอน
                    "accountFromName": data.accountFromName,
                    "accountFromType": "2", // กำหนด ประเภทบัญชี
                    "accountTo": data.accountTo,
                    "accountToBankCode": data.accountToBankCode,
                    "accountToName": data.accountToName,
                    "amount": "1.00",
                    "botFee": 0,
                    "channelFee": 0,
                    "fee": 0,
                    "feeType": "",
                    "pccTraceNo": data.pccTraceNo,
                    "scbFee": 0,
                    "sequence": data.sequence,
                    "terminalNo": data.terminalNo,
                    "transactionToken": data.transactionToken,
                    "transferType": data.transferType
                })
                request.post({
                    url: `${SCB_API}/v3/transfer/confirmation`,
                    headers: {
                        'Accept-Language': 'th',
                        'Api-Refresh': API_AUTH
                    },
                    body: body
                }, (err, respon) => {
                    if (err) throw new Error(err);
                    var result = JSON.parse(respon.body);
                    res.json({ result });
                });

            } else {
                res.json({ result });
            }
        });
    });
})

module.exports = routes;