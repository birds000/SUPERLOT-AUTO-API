const conn = require('../util/connectDB');
const USERNAME_DEFULT = "E22";
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

function UserFindByID(id, callback) {
    var sql = `SELECT * FROM tb_user u, tb_bank b WHERE u.user_bank_id = b.bank_id AND u.user_id = ?`;
    conn.query(sql, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    })
}

function UserFindByUserid(userID, callback) {
    var sql = `SELECT * FROM tb_user u, tb_bank b WHERE u.user_bank_id = b.bank_id AND u.user_userid = ?`;
    conn.query(sql, [userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
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

function UserUpdateUsername(userID, callback) {
    var sql = `UPDATE tb_user SET user_username = (SELECT 
        concat(
            char(round(rand()*25)+65),
            char(round(rand()*25)+65),
            round(rand()*25)+65,
            round(rand()*25)+65
        ) 
    ) WHERE user_userId = ?`;
    conn.query(sql, [username, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

function UserRandom(callback) {
    var sql = `(SELECT 
                    concat(
                        char(round(rand()*25)+65),
                        char(round(rand()*25)+65),
                        round(rand()*25)+65,
                        round(rand()*25)+65
                    ) 
                ) AS username,
                (SELECT 
                    concat(
                        char(round(rand()*25)+65),
                        char(round(rand()*25)+65),
                        round(rand()*25)+65,
                        round(rand()*25)+65
                    ) AS random
                ) AS password`;
    conn.query(sql, (err, result) => {
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
                CONCAT('${USERNAME_DEFULT}', (SELECT 
                    concat(
                        char(round(rand()*25)+65),
                        char(round(rand()*25)+65),
                        round(rand()*25)+65,
                        round(rand()*25)+65
                    )
                )),
                (SELECT 
                    concat(
                        char(round(rand()*25)+65),
                        char(round(rand()*25)+65),
                        round(rand()*25)+65,
                        round(rand()*25)+65
                    ) 
                ), 
                ?, ?, ?, ?)`;

    conn.query(sql, [userID, name, phone, banknumber, bankID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            console.log(result.insertId)
            UserFindByID(result.insertId, function (err, data) {
                if(err){
                    callback(err, null);    
                } else {
                    callback(null, data);    
                }
            })
        }
    })
}

module.exports = { UserAll, UserUpdate, UserAdd, UserRandom, UserFindByUserid, UserFindByID };