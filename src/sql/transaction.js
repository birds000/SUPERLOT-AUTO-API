const conn = require('../util/connectDB');

function TransactionAll(callback) {
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

// ค้นหาข้อมูล ถอน
function TransactionWithdrawFindByUUID(user_userID, callback) {
    var sql = `SELECT t.* FROM tb_transaction t, tb_user u WHERE t.user_id = u.user_id AND transaction_creditflag = 'D' AND u.user_userId = ?`;
    conn.query(sql, [user_userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

// ค้นหาข้อมูล ฝาก
function TransactionDepositFindByUUID(user_userID, callback) {
    var sql = `SELECT t.* FROM tb_transaction t, tb_user u WHERE t.user_id = u.user_id AND transaction_creditflag = 'C' AND u.user_userId = ?`;
    conn.query(sql, [user_userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

// add ข้อมูล transaction
function TransactionAdd(transaction_datetime, transaction_amount, transaction_remark, transaction_creditflag, user_id, callback) {
    var sql = 'INSERT INTO `tb_transaction`(`transaction_datetime`, `transaction_amount`, `transaction_remark`, `transaction_currency`, `transaction_creditflag`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [transaction_datetime, transaction_amount, transaction_remark, '764', transaction_creditflag, user_id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { TransactionAll, TransactionWithdrawFindByUUID, TransactionDepositFindByUUID, TransactionAdd };