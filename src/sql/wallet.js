const conn = require('../util/connectDB');

function WalletAll(callback) {
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

// เติมเงิน
function WalletTopup(amount, userID, callback) {
    var sql = `UPDATE tb_wallet SET wallet_balance = ((SELECT wallet_balance FROM tb_wallet WHERE user_id = ?) + ?) WHERE user_id = ?`;
    conn.query(sql, [userID, amount, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

function WalletFindByUserID(userID, callback) {
    var sql = `SELECT * FROM tb_wallet WHERE user_id = ?`;
    conn.query(sql, [userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { WalletAll, WalletTopup, WalletFindByUserID };