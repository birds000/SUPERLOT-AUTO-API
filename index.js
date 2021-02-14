const mysql = require('mysql');
const express = require('express');
const app = express();

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '122f059e0f10a01039885e66c7b60fb5d32b049153f48f89',
    database: 'ruay'
});
conn.connect();

app.get('/', (req, res) => {
    res.send('Welcome To API Ruay')
})

// user/userID/:user_id ดึงข้อมูล user_ID ที่ระบุ
app.get('/user/userID/:userID', (req, res) => {
    console.log("Fething userID with..." + req.params.userID)
    var userID = req.params.userID;
    var sql = `SELECT u.user_username, u.user_password, u.user_banknumber, b.bank_name_eg, b.bank_name_th, w.wallet_balance 
                FROM tb_user u, tb_wallet w, tb_bank b 
                WHERE u.user_bank_id = b.bank_id AND u.user_id = w.user_id AND u.user_userId = ?`;
    conn.query(sql, [userID], (err, rows, fields) => {
        console.log("success!");
        console.log('err : ' + err);
        console.log('fields : ' + fields);
        res.json(rows[0]);
    })
})

app.listen(8080, () => {
    console.log('Start server at port 8080.')
})