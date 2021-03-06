const conn = require('../util/connectDB');

function UserAll(callback) {
    var sql = `SELECT * FROM tb_user`;
    conn.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

function UserFindByUserid(userID, callback) {
    var sql = `SELECT * FROM tb_user u, tb_bank b, tb_wallet w WHERE u.user_bank_id = b.bank_id AND u.user_id = w.user_id AND u.user_userid = ?`;
    conn.query(sql, [userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            if (result.length == 0) {
                callback(null, { message: "ไม่พบข้อมูลผู้ใช้", status: "fail"});
            } else {
                callback(null, result[0]);
            } 
            
        }
    })
}

function UserUpdate(bankID, bankNumber, telphone, userID, callback) {
    var sql = `UPDATE tb_user SET user_bank_id = ?, user_banknumber = ?, user_phone = ? WHERE user_userId = ?`;
    conn.query(sql, [bankID, bankNumber, telphone, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

function UserAdd(userID, name, phone, banknumber, bankID, callback) {
    var sql = `INSERT INTO tb_user (user_userId, user_username, user_password, user_name, user_phone, user_banknumber, user_bank_id) 
                VALUES (?, 
                (SELECT 
                    concat(
                        char(round(rand()*25)+65),
                        char(round(rand()*25)+65),
                        round(rand()*25)+65,
                        round(rand()*25)+65
                    ) AS random
                ),
                (SELECT 
                    concat(
                        char(round(rand()*25)+65),
                        char(round(rand()*25)+65),
                        round(rand()*25)+65,
                        round(rand()*25)+65
                    ) AS random
                ), 
                ?, ?, ?, ?)`;

    conn.query(sql, [userID, name, phone, banknumber, bankID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

module.exports = { UserAll, UserUpdate, UserAdd, UserFindByUserid };