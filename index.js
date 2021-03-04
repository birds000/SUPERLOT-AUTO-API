const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')
const app = express();

// COMPONENT
const USERID = require('./src/component/database/user');
const UPDATE_BANK = require('./src/component/database/updateBank');
const HOME = require('./src/component/home/welcome');
const SCB_TANSACTION = require('./src/component/scb/transfer');
const LINEBOT = require('./src/component/linebot/index');
const BANK = require('./src/component/database/bank');
const TRANSACTIONS_DEPOSIT = require('./src/component/transactions/deposit');
const TRANSACTIONS_WITHDRAW = require('./src/component/transactions/withdraw');

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
app.get('/', HOME)
app.get('/bank/all/callbank', HOME)
app.get('/param/:param', HOME)

// LINE BOT
app.get('/line/reply', LINEBOT)
app.post('/line/userprofile', LINEBOT)
app.get('/line', LINEBOT)

// Database
// USER
app.get('/user/userID/:userID', USERID)
app.post('/user/add', USERID)
app.post('/user/update', USERID)
// BANK
app.get('/bank/all', BANK)
app.get('/scb/transfer/eligiblebanks', UPDATE_BANK)
app.get('/scb/update/eligiblebanks', UPDATE_BANK)
app.get('/scb/add/eligiblebanks', UPDATE_BANK)


// Transaction
app.post(`${API_V1}/transaction/withdraw`, TRANSACTIONS_WITHDRAW)

app.listen(PORT, () => {
    console.log('Start server at port '+ PORT)
})