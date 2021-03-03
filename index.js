const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors')
const app = express();
const USERID = require('./src/component/database/user');
const HOME = require('./src/component/home/welcome');
// const SCB = require('./src/component/scb_sandbox/authorization');
const SCB = require('./src/component/scb/index');
const SCB_ELIGIBLEBANK = require('./src/component/scb/eligiblebanks');
const SCB_TANSACTION = require('./src/component/scb/transfer');
const LINEBOT = require('./src/component/linebot/index');
const BANK = require('./src/component/database/bank');
const TRANSACTIONS_DEPOSIT = require('./src/component/transactions/deposit');
const TRANSACTIONS_WITHDRAW = require('./src/component/transactions/withdraw');

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
app.get('/param/:param', HOME)

// SCB Sandbox
// app.get('/scb/oauth', SCB)

// SCB 
app.post('/scb/login/refresh', SCB)
app.post('/scb/transfer/verification', SCB) 
app.post('/scb/transfer/confirmation', SCB) 

// SCB eligiblebanks
app.get('/scb/transfer/eligiblebanks', SCB_ELIGIBLEBANK)
app.get('/scb/update/eligiblebanks', SCB_ELIGIBLEBANK)
app.get('/scb/add/eligiblebanks', SCB_ELIGIBLEBANK)

// SCB_TANSACTION
// app.post('/scb/transfer/verification', SCB_TANSACTION) 

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


// Transaction
app.post(`${API_V1}/transaction/withdraw`, TRANSACTIONS_WITHDRAW)
// app.get(`${API_V1}/test`, TRANSACTIONS_WITHDRAW)
// app.post(`${API_V1}/deposit`, TRANSACTIONS_DEPOSIT)

app.listen(PORT, () => {
    console.log('Start server at port '+ PORT)
})