const conn = require('../util/connectDB');

function TansactionAll(callback) {
    var sql = `SELECT * FROM tb_transaction`;
    conn.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

// add ข้อมูล tansaction
function TansactionAdd(transaction_datetime, transaction_amount, transaction_remark, user_id, callback) {
    var sql = 'INSERT INTO `tb_transaction`(`transaction_datetime`, `transaction_amount`, `transaction_remark`, `user_id`) VALUES (?, ?, ?, ?)';
    conn.query(sql, [transaction_datetime, transaction_amount, transaction_remark, user_id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { TansactionAll, TansactionAdd };