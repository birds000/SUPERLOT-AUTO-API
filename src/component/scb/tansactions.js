const axios = require('axios');
const { SCB_API } = require('../../util/connectSCB');

async function loginRefresh(apiAuth) {
    var data = JSON.stringify({ 
        "accountNo": "4094138047", 
        "endDate": "2021-03-03", 
        "pageNumber": "1", 
        "pageSize": 20, 
        "productType": "2", 
        "startDate": "2021-03-03" 
    });
    var config = {
        method: 'post',
        url: `${SCB_API}/v2/deposits/casa/transactions`,
        headers: {
            'Accept-Language': 'th',
            'Api-Auth': apiAuth,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        // console.log(JSON.stringify(response.data));
        const result = JSON.stringify(response.data);
        return result

    } catch (error) {
        // console.error(error);
        return error
    }
}

module.exports = { loginRefresh };
