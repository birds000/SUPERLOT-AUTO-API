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
    res.send('Welcom To API Ruay')
})

// ---------------------------- START USER ------------------------------ //

// users ดึงข้อมูลทั้งหมด
app.get('/users', (req, res) => {
    conn.query("SELECT u.user_username, u.user_password, u.user_banknumber, w.wallet_balance FROM tb_user u, tb_wallet w", (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// user/userID/:user_id ดึงข้อมูล user_ID ที่ระบุ
app.get('/user/userID/:userID', (req, res) => {
    console.log("Fething user with..." + req.params.userID)
    var userID = req.params.userID;
    var sql = "SELECT u.user_username, u.user_password, u.user_banknumber, w.wallet_balance FROM tb_user u, tb_wallet w WHERE u.user_userId = ?";
    conn.query(sql, [userID], (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// user/id/:id ดึงข้อมูล id ที่ระบุ
app.get('/user/id/:id', (req, res) => {
    console.log("Fething user with..." + req.params.id)
    var id = req.params.id;
    var sql = "SELECT u.user_username, u.user_password, u.user_banknumber, w.wallet_balance FROM tb_user u, tb_wallet w WHERE u.user_id = ?";
    conn.query(sql, [id], (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// user/username/:username ดึงข้อมูล id ที่ระบุ
app.get('/user/username/:username', (req, res) => {
    console.log("Fething user with..." + req.params.username)
    var username = req.params.username;
    var sql = "SELECT u.user_username, u.user_password, u.user_banknumber, w.wallet_balance FROM tb_user u, tb_wallet w WHERE u.user_username = ?";
    conn.query(sql, [username], (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// ----------------------------- END USER -------------------------- //



// ---------------------------- START WALLET ----------------------- //

// wallet ดึงข้อมูลทั้งหมด
app.get('/wallets', (req, res) => {
    conn.query("SELECT * FROM tb_wallet", (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// wallet/id/:id ดึงข้อมูล id ที่ระบุ
app.get('/wallet/id/:id', (req, res) => {
    console.log("Fething user with..." + req.params.id)
    var id = req.params.id;
    var sql = "SELECT wallet_balacne FROM tb_wallet WHERE wallet_id = ?";
    conn.query(sql, [id], (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// wallet/userID/:userID ดึงข้อมูล userID ที่ระบุ
app.get('/wallet/userID/:userID', (req, res) => {
    console.log("Fething user with..." + req.params.userID)
    var userID = req.params.userID;
    var sql = "SELECT wallet_balacne FROM tb_wallet WHERE user_id = ?";
    conn.query(sql, [userID], (err, rows, fields) => {
        console.log("success!");
        res.json(rows);
    })
})

// ---------------------------- END WALLET ----------------------- //


app.listen(8200, () => {
    console.log('Start server at port 8200.')
})