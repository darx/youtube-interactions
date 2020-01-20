const helpers = require('../../common/helpers');
const Requests = require('../../controllers/requests');

class Account {

    async login (req, res) {

        let params = {
            client_id: process.env.YOUTUBE_API_CLIENT_ID,
            redirect_uri: 'https://www.google.com/',
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            response_type: 'code',
        };

        let options = {
            method: 'GET',
            url: 'https://accounts.google.com/o/oauth2/v2/auth',
            data: params,
        };

        try {
            let rqt = await Requests.http(options);
    
            return helpers.static(res, rqt);
        }

        catch (e) {
            return helpers.error(res, e);
        }

    }

}

module.exports = new Account();