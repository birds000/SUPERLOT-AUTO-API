const mysql = require('mysql');

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '122f059e0f10a01039885e66c7b60fb5d32b049153f48f89',
    database: 'ruay'
    // password: '',
    // database: 'test'
});
conn.connect();

module.exports = conn;