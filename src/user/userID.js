const routes = require('express').Router();
const conn = require('../util/connectDB');

// user/userID/:user_id ดึงข้อมูล user_ID ที่ระบุ
routes.get('/user/userID/:userID', (req, res) => {
    console.log("Fething userID with..." + req.params.userID)
    var userID = req.params.userID;
    var sql = `SELECT u.user_username, u.user_password, u.user_phone, u.user_banknumber, b.bank_name_eg, b.bank_name_th, w.wallet_balance 
                FROM tb_user u, tb_wallet w, tb_bank b 
                WHERE u.user_bank_id = b.bank_id AND u.user_id = w.user_id AND u.user_userId = ?`;
    conn.query(sql, [userID], (err, rows, fields) => {
        console.log("success!");
        console.log('err : ' + err);
        console.log('fields : ' + fields);
        res.json(rows[0]);
    })
});

module.exports = routes;