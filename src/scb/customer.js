// GET v2/oauth/authorize
var options = {
  'method': 'GET',
  'url': 'https://api-sandbox.partners.scb/partners/sandbox/v2/oauth/authorize',
  'headers': {
    'apikey': 'l7b98143a486974c5cbda6de89879ba944',
    'apisecret': 'ee69f427154f4775bbf2586754e51cdb',
    'resourceOwnerId': 'l7b98143a486974c5cbda6de89879ba944',
    'requestUId': 'ab7d8989-5b08-44a2-9226-35da7a9caaaa',
    'response-channel': 'mobile',
    'endState': 'mobile_app',
    'accept-language': 'EN',
    'Cookie': 'TS01e7ba6b=01a990b48e1e460c47c4d758cdd753ae7597f83fbd194df2477f80949c121ca56a3cea11d1f26ae8c9aadcf2cc195f8288413049be'
  }
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
