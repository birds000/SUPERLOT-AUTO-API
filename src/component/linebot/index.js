const routes = require('express').Router();
const request = require('request');
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const CHANNEL_ACCESS_TOKEN = 'e2gG9wh+xzndkztLpVhmQQLrf6DVLzEty7yf0WA5ZA3Kg7Yo3RuOuKwFUDglCqSmjWKOewNMu4CjCAz5nVpp8Fy00IbtJmbE5e5atsH5TPJDXcQmOODV5jzHSCmQvphD8rg+UFCn4YNScwNtVjnzvwdB04t89/1O/w1cDnyilFU=';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
};

const RUAY = 'http://178.128.221.76';
const RUAY_API = RUAY + ':8080';

function reply(reply_token) {
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Hello'
        },
        {
            type: 'text',
            text: 'How are you?'
        }]
    })

    request.post({
        url: `${LINE_MESSAGING_API}/message/reply`,
        headers: LINE_HEADER,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}

routes.get('/line/reply', (req, res) => {
    let reply_token = req.body.events[0].replyToken
    reply(reply_token)
    res.sendStatus(200)
})

routes.post('/line/userprofile', (req, res) => {
    var userid = req.body.userid;
    // console.log('userid : ' + userid);
    request.get({
        url: `${LINE_MESSAGING_API}/profile/${userid}`,
        headers: LINE_HEADER
    }, (err, respon, body) => {
        // console.log('status = ' + respon.statusCode);
        var result = JSON.parse(body);
        res.json({ result });
    });
})

routes.get('/line', (req, res) => {
    res.send('Welcome To line')
})

module.exports = routes;