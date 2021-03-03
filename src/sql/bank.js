const conn = require('../util/connectDB');

function BankAll(callback) {
    var sql = `SELECT * FROM tb_wallet`;
    conn.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { BankAll };