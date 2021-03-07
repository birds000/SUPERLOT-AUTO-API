const conn = require('../util/connectDB');

function WalletAll(callback) {
    var sql = `SELECT * FROM tb_wallet`;
    conn.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

function WalletAdd(userID, callback) {
    var sql = `INSERT INTO tb_wallet(wallet_balance, user_id) VALUES (0, ?)`;
    conn.query(sql, [userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

// เติมเงิน
function WalletTopup(amount, userID, callback) {
    var sql = `UPDATE tb_wallet SET wallet_balance = (wallet_balance + ?) WHERE user_id = ?`;
    conn.query(sql, [amount, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

// ถอนเงิน
function WalletWithdraw(amount, userID, callback) {
    var sql = `UPDATE tb_wallet SET wallet_balance = (wallet_balance - ?) WHERE user_id = ?`;
    conn.query(sql, [amount, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

function WalletFindByUserID(userID, callback) {
    var sql = `SELECT * FROM tb_wallet WHERE user_id = ?`;
    conn.query(sql, [userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

module.exports = { WalletAll, WalletAdd, WalletTopup, WalletWithdraw, WalletFindByUserID };