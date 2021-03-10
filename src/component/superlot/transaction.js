const axios = require('axios');
const { SUPERLOT_API, SUPERLOT_TOKEN } = require('../../util/connectSuperlot');

// GET Transactions
async function GetTransactions(username, from, to) {
    var config = {
        method: 'get',
        url: `${SUPERLOT_API}/transactions?username=${username}&from=${from}&to=${to}`,
        headers: { 
          'Authorization': `Bearer ${SUPERLOT_TOKEN}`
        }
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

module.exports = { GetMember, CreateMember };