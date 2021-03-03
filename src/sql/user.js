const conn = require('../util/connectDB');

function UserAll(callback) {
    var sql = `SELECT * FROM tb_user`;
    conn.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

function UserFindByUserid(userid, callback) {
    var sql = `SELECT * FROM tb_user u, tb_bank b WHERE u.bank_id = b.bank_id AND u.user_userid = ?`;
    conn.query(sql, [userid], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const data = JSON.stringify({ status: "success", result });
            callback(null, data);
        }
    })
}

module.exports = { UserAll, UserFindByUserid };