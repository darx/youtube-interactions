const helpers = require('../../common/helpers');
const Requests = require('../../controllers/requests');

class Channel {

    async lookup (req, res, uname) {

        if ('string' !== typeof uname) {
            throw new Error('Channel.lookup @param { uname } must be a string');
        }

        let params = {
            key: process.env.YOUTUBE_API_KEY,
            part: 'id',
            forUsername: uname,
        };

        let options = {
            url: process.env.YOUTUBE_API_PATH + '/channels',
            method: 'GET',
            data: params,
        };

        try {
            let rqt   = await Requests.http(options),
                Items = rqt.items[0];

            return helpers.success(res, Items);
        }

        catch (e) {
            return helpers.error(res, e);
        }

    }

    async videos (req, res, id, paginate) {

        let params = {
            key: process.env.YOUTUBE_API_KEY,
            channelId: id,
            part: 'snippet,id',
            order: 'date',
            maxResults: 20,
        };

        if (paginate) {
            params.pageToken = paginate;
        }

        let options = {
            url: process.env.YOUTUBE_API_PATH + '/search',
            method: 'GET',
            data: params,
        };

        try {
            let rqt   = await Requests.http(options),
                Items = rqt.items;
            
            return helpers.success(res, Items);
        }

        catch (e) {
            return helpers.error(res, e);
        }

    }

    async comments (req, res, id) {

    }

}

module.exports = new Channel();