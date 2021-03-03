const conn = require('../util/connectDB');

// add ข้อมูล tansaction
function addTansaction(transaction_datetime, transaction_amount, transaction_remark, transaction_currency, transaction_creditflag, user_id, callback) {
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

module.exports = { addTansaction };