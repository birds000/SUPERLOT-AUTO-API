const axios = require('axios');
const { SUPERLOT_API, SUPERLOT_TOKEN } = require('../../util/connectSuperlot');

// GET Member
async function GetMember(username) {
    var config = {
        method: 'GET',
        url: `${SUPERLOT_API}/members?username=${username}`,
        headers: {
            'Authorization': `Bearer 91f671b725118043925163817d00b38c12ed94ce9650285d2183c362722ece3f`,
        }
    };

    try {
        const response = await axios(config);
        // console.log(JSON.stringify(response.data));
        const result = response.data;
        return result

    } catch (error) {
        // console.error(error);
        return error
    }
}

// CREATE Member
async function CreateMember(username, password, name, phone) {
    var data = JSON.stringify({ 
        "copy_from": "E22123", 
        "username": username, 
        "password": password, 
        "name": name, 
        "phone": phone 
    });

    var config = {
        method: 'post',
        url: `${SUPERLOT_API}/members`,
        headers: {
            'Authorization': `Bearer ${SUPERLOT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const response = await axios(config);
        // console.log(JSON.stringify(response.data));
        const result = response.data;
        return result

    } catch (error) {
        // console.error(error);
        return error
    }
}

module.exports = { GetMember, CreateMember };