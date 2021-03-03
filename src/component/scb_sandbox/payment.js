var request = require('request');

// POST v1/oauth/token
var options = {
  'method': 'POST',
  'url': 'https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token',
  'headers': {
    'Content-Type': 'application/json',
    'resourceOwnerId': 'l7b98143a486974c5cbda6de89879ba944',
    'requestUId': '18af07d7-8111-4fda-80ec-2ad81bb6436f',
    'accept-language': 'EN',
    'Cookie': 'TS01e7ba6b=01e76b033caf59b1cde78fe975da31c44d6326bbec44b541ae67aa74be2c950dcba26da951a5cd721929ce1295f0929f9e711176e3'
  },
  body: JSON.stringify({"applicationKey":"l7b98143a486974c5cbda6de89879ba944","applicationSecret":"ee69f427154f4775bbf2586754e51cdb"})

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});


// POST v3/deeplink/transactions
var options = {
    'method': 'POST',
    'url': 'https://api-sandbox.partners.scb/partners/sandbox/v3/deeplink/transactions',
    'headers': {
        'Content-Type': 'application/json',
        'authorization': 'Bearer 8dfec741-d65d-4595-86cb-b743a5a7ccf6',
        'resourceOwnerId': 'l7b98143a486974c5cbda6de89879ba944',
        'requestUId': 'c97f2af3-3b9c-49f0-9aea-141b1a041107',
        'channel': 'scbeasy',
        'accept-language': 'TH',
        'Cookie': 'TS01e7ba6b=01e76b033c391bd42eb69436ac2f2fc5eb1190b981f901a8e64d08bfef96649cf94f45ab677df7b9f997fb2ce6ea1fa4c8bbb98d2c'
    },
    body: JSON.stringify({ "transactionType": "PURCHASE", "transactionSubType": ["BP"], "sessionValidityPeriod": 60, "sessionValidUntil": "", "billPayment": { "paymentAmount": 100, "accountTo": "287685458415327", "ref1": "1234567890", "ref2": "12345", "ref3": "SCB" }, "merchantMetaData": { "callbackUrl": "http://my.server.com/bar", "merchantInfo": { "name": "TestMerchant1613364543" }, "extraData": {}, "paymentInfo": [{ "type": "TEXT_WITH_IMAGE", "title": "", "header": "", "description": "", "imageUrl": "" }, { "type": "TEXT", "title": "", "header": "", "description": "" }] } })

};

app.get('/scb', (req, res) => {
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.json(JSON.parse(response.body))
    });
})

// GET v2/transactions/{transactionsId}
var options = {
  'method': 'GET',
  'url': 'https://api-sandbox.partners.scb/partners/sandbox/v2/transactions/e88eedf8-3c9a-4008-bfcc-7e2a693d931d',
  'headers': {
    'authorization': 'Bearer 8dfec741-d65d-4595-86cb-b743a5a7ccf6',
    'resourceOwnerId': 'l7b98143a486974c5cbda6de89879ba944',
    'requestUId': '44f10452-5ac0-402a-8136-37bd754bf65e',
    'accept-language': 'EN',
    'Cookie': 'TS01e7ba6b=01e76b033cc1867fe398df0e8661fed5752efa37be67cf0f52132aceb81f4e3fc633f079d517ec2171c8dc980259b6b7065c2ca496'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
