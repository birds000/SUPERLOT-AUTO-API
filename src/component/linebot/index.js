const routes = require('express').Router();
const request = require('request');
const { LINE_MESSAGING_API, CHANNEL_ACCESS_TOKEN } = require('../../util/config');
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
};

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