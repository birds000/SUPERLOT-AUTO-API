const axios = require('axios');
const { SUPERLOT_API, SUPERLOT_TOKEN } = require('../../util/connectSuperlot');

// ถอน
async function Withdraw(username, amount) {
    var data = JSON.stringify({ "username": username, "amount": -amount });

    var config = {
        method: 'post',
        url: `${SUPERLOT_API}/transfer`,
        headers: {
            'Authorization': `Bearer ${SUPERLOT_TOKEN}`,
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

// ฝาก
async function Deposit(username, amount) {
    var data = JSON.stringify({ "username": username, "amount": amount });

    var config = {
        method: 'post',
        url: `${SUPERLOT_API}/transfer`,
        headers: {
            'Authorization': `Bearer ${SUPERLOT_TOKEN}`,
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

module.exports = { Withdraw, Deposit };