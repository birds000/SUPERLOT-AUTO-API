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

function TansactionFindByUUID(user_userID, callback) {
    var sql = `SELECT t.* FROM tb_transaction t, tb_user u WHERE t.user_id = u.user_id AND u.user_userId = ?`;
    conn.query(sql, [user_userID], (err, result) => {
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
    var sql = 'INSERT INTO `tb_transaction`(`transaction_datetime`, `transaction_amount`, `transaction_remark`, `transaction_currency`, `transaction_creditflag`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [transaction_datetime, transaction_amount, transaction_remark, '764', "D", user_id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { TansactionAll, TansactionFindByUUID, TansactionAdd };