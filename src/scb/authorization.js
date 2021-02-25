const routes = require('express').Router();
const request = require('request');

// GET v2/oauth/authorize
var options = {
  'method': 'GET',
  'url': 'https://api-sandbox.partners.scb/partners/sandbox/v2/oauth/authorize',
  'headers': {
    'apikey': 'l7b98143a486974c5cbda6de89879ba944',
    'apisecret': 'ee69f427154f4775bbf2586754e51cdb',
    'resourceOwnerId': 'l7b98143a486974c5cbda6de89879ba944',
    'requestUId': 'e9356849-8157-404a-8545-328487cb78cf',
    'response-channel': 'mobile',
    'endState': 'mobile_app',
    'accept-language': 'TH',
    'Cookie': 'TS01e7ba6b=01e76b033cc1867fe398df0e8661fed5752efa37be67cf0f52132aceb81f4e3fc633f079d517ec2171c8dc980259b6b7065c2ca496'
  }
};

routes.get('/scb/oauth', (req, res) => {
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send(response.body);
  });
})

module.exports = routes;