const axios = require('axios');
const { SCB_API, ACCOUNT_FROM, ACCOUNT_FROMTYPE } = require('../../util/connectSCB');

async function Verification(apiAuth, accountTo, accountToBankCode, amount) {
    var data = JSON.stringify({
        "accountFrom": ACCOUNT_FROM,
        "accountFromType": ACCOUNT_FROMTYPE,
        "accountTo": accountTo,
        "accountToBankCode": accountToBankCode,
        "amount": amount,
        "annotation": null,
        "transferType": accountToBankCode == "014" ? "3RD" : "ORFT"  // ใช้ ORFT แต่ถ้าไทยพาณิชย์ใช้ 3RD 
    });
    console.log(data)
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
        const result = response.data;
        return result

    } catch (error) {
        // console.error(error);
        return error
    }

}

async function Confirmation(apiAuth, accountFromName, accountTo, accountToBankCode, accountToName, amount, pccTraceNo, sequence, terminalNo, transactionToken, transferType) {
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
        "transferType": transferType
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
        const result = response.data;
        return result

    } catch (error) {
        // console.error(error);
        return error
    }

}

module.exports = { Verification, Confirmation };