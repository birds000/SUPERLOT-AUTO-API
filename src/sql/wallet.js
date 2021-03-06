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

// เติมเงิน
function WalletTopup(amount, userID, callback) {
    var sql = `UPDATE tb_wallet SET wallet_balance = ((SELECT wallet_balance FROM tb_wallet WHERE user_id = ?) + ?) WHERE user_id = ?`;
    conn.query(sql, [userID, amount, userID], (err, result) => {
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

module.exports = { WalletAll, WalletTopup, WalletFindByUserID };