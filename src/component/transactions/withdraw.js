const routes = require('express').Router();
// const axios = require('axios');
const { URL, PORT, API_V1 } = require('../../util/config');
// const { SCB_API, API_REFRESH, API_AUTH, DEVICEID } = require('../../util/connectSCB')
const { loginRefresh } = require('../scb/login');
const { verification, confirmation } = require('../scb/transfer');
const { TansactionAdd } = require('../../sql/transaction')
const { UserFindByUserid } = require('../../sql/user')

routes.post(`${API_V1}/transaction/withdraw`, async (req, res) => {
    // req.body
    const userID = req.body.userID
    const amount = req.body.amount
    const accountTo = req.body.accountTo
    const accountToBankCode = req.body.accountToBankCode

    const err = { status: "fail", message: "error" }
    
    var remark = ''

    UserFindByUserid(userID, function (err, data) {
        if (err) {
            res.json({ result: err })
        } else {
            const result = JSON.parse(data).result
            remark = result.user_banknumber
            res.json({ result })
        }
    });

    // SCB login
    // const access_token = JSON.parse(await loginRefresh()).data.access_token;
    // if (access_token) {
    //     // SCB verification
    //     const res_verification = JSON.parse(await verification(access_token, accountTo, accountToBankCode, amount))

    //     if (res_verification.status.code == "1000") {
    //         const data = res_verification.data
    //         const res_confirmationn = JSON.parse(await confirmation(access_token, data.accountFromName, accountTo, accountToBankCode, data.accountToName, amount, data.pccTraceNo, data.sequence, data.terminalNo, data.transactionToken))

    //         if(res_confirmationn.status.code == "1000") {
    //             data = res_verification.data
    //             addTansaction(data.transactionDateTime, amount, transaction_remark, userID, function (err, data) {
    //                 if (err) {
    //                     res.json({ result: err })
    //                 } else {
    //                     res.json({ result: res_confirmationn, userID, amount })
    //                 }
    //             });
                
    //         } else {
    //             res.json(err)
    //         }
    //     } else {
    //         res.json(err)
    //     }

    // } else {
    //     res.json(err)
    // }
})


module.exports = routes;