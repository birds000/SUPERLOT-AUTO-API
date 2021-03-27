const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')
const app = express();

// COMPONENT
const USERID = require('./src/component/database/user');
const UPDATE_BANK = require('./src/component/database/updateBank');
const HOME = require('./src/component/home/welcome');

const LINEBOT = require('./src/component/linebot/index');
const BANK = require('./src/component/database/bank');
const TRANSFER_DEPOSIT = require('./src/component/transfer/deposit');
const TRANSFER_WITHDRAW = require('./src/component/transfer/withdraw');
const TRANSFER_LOGIN = require('./src/component/transfer/login');
const SUPERLOT = require('./src/component/superlot/test');
const RUAYLOTTO = require('./src/component/ruaylotto/test');

// UTIL
const { URL, PORT, API_V1 } = require('./src/util/config'); 

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// HOME
app.get(`/api/v1/`, HOME)
app.get(`/api/v1/bank/all/callbank`, HOME)
app.get(`/api/v1/param/:param`, HOME)

// LINE BOT
app.get(`/api/v1/line/reply`, LINEBOT)
app.post(`/api/v1/line/userprofile`, LINEBOT)
app.get(`/api/v1/line`, LINEBOT)

// Database
// USER
app.get(`/api/v1/user/userID/:userID`, USERID)
app.post(`/api/v1/user/add`, USERID)
app.post(`/api/v1/user/update`, USERID)
// BANK
app.get(`/api/v1/bank/all`, BANK)
app.get(`/api/v1/scb/transfer/eligiblebanks`, UPDATE_BANK)
app.get(`/api/v1/scb/update/eligiblebanks`, UPDATE_BANK)
app.get(`/api/v1/scb/add/eligiblebanks`, UPDATE_BANK)


// Transfer
app.get(`/api/v1/transfer/login/refresh`, TRANSFER_LOGIN)
app.post(`/api/v1/transfer/withdraw`, TRANSFER_WITHDRAW) 
app.post(`/api/v1/transfer/deposit`, TRANSFER_DEPOSIT)

app.get(`/api/v1/test/superlot`, SUPERLOT);
app.get(`/api/v1/test/ruaylotto`, RUAYLOTTO);


app.listen(PORT, () => {
    console.log('Start server at port '+ PORT)
})