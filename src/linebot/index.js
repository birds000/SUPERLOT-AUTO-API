const routes = require('express').Router();
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
const CHANNEL_ACCESS_TOKEN = 'PDOSXQkeSRrfbQbJnN7deJmeyTBotM16MGdvwkRFrxT7jb/wjl/Ys+QKieTkzuC7KcKguIdqtcVXJJ6PMBvt12FibpE1xMDsU3WMhTofpa4MfXNwx1Ybben3xkVfBzNDEntAm0mIocTooqcJs9YGUAdB04t89/1O/w1cDnyilFU=';
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

routes.get('/linebot', (req, res) => {
    let reply_token = req.body.events[0].replyToken
    reply(reply_token)
    res.sendStatus(200)
    // console.log("linebot")
})

module.exports = routes;