const axios = require('axios');
const { SCB_API, ACCOUNT_FROM, ACCOUNT_FROMTYPE, TRANSFER_TYPE } = require('../../util/connectSCB');

async function verification(apiAuth, accountTo, accountToBankCode, amount) {
    var data = JSON.stringify({
        "accountFrom": "4094138047",
        "accountFromType": "2",
        "accountTo": accountTo,
        "accountToBankCode": accountToBankCode,
        "amount": amount,
        "annotation": null,
        "transferType": "ORFT"
    });
    var config = {
        method: 'post',
        url: `${SCB_API}/v2/transfer/verification`,
        headers: {
            'Accept-Language': 'th',
            'Api-Auth': apiAuth,
            'Content-Type': 'application/json',
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

async function confirmation(apiAuth, accountFromName, accountTo, accountToBankCode, accountToName, amount, pccTraceNo, sequence, terminalNo, transactionToken) {
    var axios = require('axios');
    var data = JSON.stringify({
        "accountFrom": ACCOUNT_FROM, // กำนหด บัญชีที่โอน
        "accountFromName": accountFromName,
        "accountFromType": ACCOUNT_FROMTYPE, // กำหนด ประเภทบัญชี
        "accountTo": accountTo,
        "accountToBankCode": accountToBankCode,
        "accountToName": accountToName,
        "amount": amount,
        "botFee": 0,
        "channelFee": 0,
        "fee": 0,
        "feeType": "",
        "pccTraceNo": pccTraceNo,
        "scbFee": 0,
        "sequence": sequence,
        "terminalNo": terminalNo,
        "transactionToken": transactionToken,
        "transferType": TRANSFER_TYPE
    });

    var config = {
        method: 'post',
        url: `${SCB_API}/v3/transfer/confirmation`,
        headers: {
            'Accept-Language': 'th',
            'Api-Auth': apiAuth,
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

module.exports = { verification, confirmation };