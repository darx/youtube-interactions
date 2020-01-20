const { readFile, readFileSync } = require('fs');

const url     = require('url');
const https   = require('https');
const qs      = require('querystring');

const helpers = require('../common/helpers');

class Requests {
    
    async index (req, res) {
    
        try {
            let data = await read('./src/app/index.html');
            var content = await this.template(data);
            return helpers.static(res, content);
        }

        catch (e) {
            return helpers.notfound(res);
        }
    
    }

    async login (req, res) {
    
        try {
            let data = await read('./src/app/login.html');
            return helpers.static(res, data);
        }

        catch (e) {
            return helpers.notfound(res);
        }
    
    }

    async template (content) {

        try {
            let head = await read('./src/app/partials/header.html');
            let foot = await read('./src/app/partials/footer.html');

            return head.concat(content + foot);
        }

        catch (e) {
            throw new Error('Failed to load template', e);
        }

    }

    async page (req, res, name) {

        try {
            let content = await read(`./src/app/${name}.html`);
            let data = await this.template(content);

            return helpers.static(res, data);
        }

        catch (e) {
            return helpers.notfound(res);
        }

    }

    async styles (req, res, name) {
        try {
            let data = await read(`./src/app/css/${name}.css`);
            return helpers.static(res, data, 200, 'text/css');
        }

        catch (e) {
            return helpers.notfound(res);
        }
    }

    async component (req, res, name) {
        try {
            let data = await read(`./src/app/components/${name}.html`);
            return helpers.static(res, data);
        }

        catch (e) {
            return helpers.notfound(res);
        } 
    }

    async scripts (req, res, name) {
        try {
            let data = await read(`./src/app/js/${name}.js`);
            return helpers.static(res, data, 200, 'application/x-javascript');
        }

        catch (e) {
            return helpers.notfound(res);
        }
    }

    http (Options) {

        let OptsURL = url.parse(Options.url);

        let Params = {
            host: OptsURL.host,
            path: OptsURL.path,
            port: OptsURL.protocol != 'https:' ? 80 : 443,
        };

        let Opts = Object.assign({}, Options, Params);

        if (Options.method.toUpperCase() == 'GET') {
            Opts.path += '?' + qs.stringify(Opts.data);
            delete Opts.data;
        }

        return new Promise((resolve, reject) => {

            const Request = https.request(Opts, (Response) => {
                let Chunks = [];

                Response.on('data', (chunk) => {
                    Chunks.push(chunk);
                });

                Response.on('end', () => {
                    let body = Buffer.concat(Chunks);

                    if (Response.statusCode == 200) {

                        body = body.toString();

                        resolve(!isJSON(body) 
                            ? body
                            : JSON.parse(body));
                    }
                    
                    else if (Response.statusCode == 202) {
                        resolve({ success: true });
                    }
                    
                    else {
                        resolve(!isJSON(body) 
                            ? body
                            : JSON.parse(body));
                    }
                });
            });

            Request.on('error', (e) => {
                reject(e);
            });

            if (Opts.data) { Request.write(Opts.data); }

            Request.end();

        });

    }

}

function read (str) {
    return new Promise((resolve, reject) => {
        readFile(str, 'utf8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

function isJSON (text) {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = new Requests();