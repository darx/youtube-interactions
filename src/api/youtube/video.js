const helpers = require('../../common/helpers');
const Requests = require('../../controllers/requests');

class Video {

	async comments (req, res, id, paginate) {

        let params = {
            key: process.env.YOUTUBE_API_KEY,
            part: 'snippet,replies',
            order: 'time',
            textFormat: 'plainText',
            videoId: id,
            maxResults: 10,
        };

        if (paginate) {
        	params.pageToken = paginate;
        }

        let options = {
            url: process.env.YOUTUBE_API_PATH + '/commentThreads',
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

}

module.exports = new Video();