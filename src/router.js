const helpers   = require('./common/helpers');
const { parse } = require('querystring');

module.exports = async (req, res, routes) => {

    const route = routes.find((route) => {

        const methodMatch = route.method === req.method;

        let pathMatch = false;

        if (typeof route.path === 'object') {
            pathMatch = req.url.match(route.path);
        }

        else {
            pathMatch = route.path === req.url;
        }

        return pathMatch && methodMatch;

    });

    let param = null;

    if (route && typeof route.path === 'object') {
        param = req.url.match(route.path)[1];
    }

    if (!route) {
        return helpers.error(res, 'Endpoint not found', 404);
    }

    let body = null;

    if (['POST', 'PUT'].indexOf(req.method) !== -1) {
        body = await getPostData(req);
    }

    return route.handler(req, res, param, body);

};

function getPostData (req) {

    return new Promise((resolve, reject) => {
  
       try {
           let body = '';
           
           req.on('data', chunk => { body += chunk.toString(); });
           req.on('end', () => { resolve(body); });
       }

       catch (e) {
           reject(e);
       }
    
    });

}