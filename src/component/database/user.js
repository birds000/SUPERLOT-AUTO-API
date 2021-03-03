const routes = require('express').Router();
const conn = require('../../util/connectDB');

// user/userID/:user_id ดึงข้อมูล user_ID ที่ระบุ
routes.get('/user/userID/:userID', (req, res) => {
    console.log("Fething userID with..." + req.params.userID)
    var userID = req.params.userID;
    var sql = `SELECT u.user_username, u.user_password, u.user_phone, u.user_bank_id, u.user_banknumber, b.bank_name_eg, b.bank_name_th, w.wallet_balance 
                FROM tb_user u, tb_wallet w, tb_bank b 
                WHERE u.user_bank_id = b.bank_id AND u.user_id = w.user_id AND u.user_userId = ?`;
    conn.query(sql, [userID], (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: "fail", message: err });    
        } else {
            res.json({ result, status: "success" });    
        }
    })
});

// UPDATE แก้ไขข้อมูลผู็เล่น
routes.post('/user/update', (req, res) => {
    var userID = req.body.userID;
    var bankID = req.body.bankID;
    var bankNumber = req.body.bankNumber;
    var telphone = req.body.telphone;

    var sql = `UPDATE tb_user SET user_bank_id = ?, user_banknumber = ?, user_phone = ? WHERE user_userId = ?`;
    conn.query(sql, [bankID, bankNumber, telphone, userID], (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: "fail", message: err });    
        } else {
            res.json({ result, status: "success", message: "แก้ไขข้อมูลเสร็จสิ้น" });    
        }
    })
})

// ADD เพิ่มผู้เล่น
routes.post('/user/add', (req, res) => {
    var userID = req.body.userID;
    var bankID = req.body.bankID;
    var bankNumber = req.body.bankNumber;
    var telphone = req.body.telphone;
    
    var sql_selcet =`SELECT user_userId FROM tb_user WHERE user_userId = ?`;
    conn.query(sql_selcet, [userID], (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: "fail", message: err });    
        } else {
            if ( result.length == 1 ) {
                console.log("มีผู้ใช้แล้ว!!");
                res.json({ status: "fail", message: "มีผู้ใช้แล้ว", result })
            } else {
                var sql_insert_user = `INSERT INTO tb_user (user_userId, user_username, user_password, user_bank_id, user_banknumber, user_phone) 
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
                    ?, ?, ?)`;
                conn.query(sql_insert_user, [userID, bankID, bankNumber, telphone], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ status: "fail", message: err });    
                    } else {
                        var lastID = result.insertId;
                        var sql_insert_wallet = `INSERT INTO tb_wallet(wallet_balance, user_id) VALUES (0, ?)`; 
                        conn.query(sql_insert_wallet, [lastID], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json({ status: "success", message: "เพิ่มข้อมูลเรียบร้อย" });
                            }
                        })
                    }
                })
            }
        }
    })
})

module.exports = routes;