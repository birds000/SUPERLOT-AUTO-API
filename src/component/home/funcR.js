
const axios = require('axios');
const routes = require('express').Router();
const conn = require('../../util/connectDB');

function testV1(value) {
    return value + 50;
}

function testV2(value) {
    return value + 50;
}

async function testAxios() {
    try {
        const response = await axios.get('https://api.github.com/users/github');
        // console.log(response.data);
        return response.data

    } catch (error) {
        console.error(error);
        return "error"
    }
}

function testDB(callback) {
    var sql = `SELECT * FROM tb_bank`;
    conn.query(sql, (err, result) => {
        if (err) {
            const data = JSON.stringify({ status: "fail", massage: err });
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { testV1, testV2, testAxios, testDB }