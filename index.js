const express = require('express');
const app = express();
const USERID = require('./src/user/userID');
const HOME = require('./src/home/welcome');
const SCB = require('./src/scb/authorization');
const LINEBOT = require('./src/linebot/index');

// HOME
app.get('/', HOME)
app.get('/param/:param', HOME)

// Database
// USER
app.get('/user/userID/:userID', USERID)

// SCB
app.get('/scb/oauth', SCB)

// LINE BOT
app.get('/linebot', LINEBOT)

app.listen(8080, () => {
    console.log('Start server at port 8080.')
})