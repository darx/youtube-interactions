class Requests {

    constructor (options) {

    }

    http (options) {

        function declareFunction () {}

        // xhr event callbacks //
        if (!options.success) { options.success = declareFunction; }
        if (!options.progress) { options.progress = declareFunction; }
        if (!options.warning) { options.warning = declareFunction; }
        if (!options.error) { options.error = declareFunction; }

        if (!window.navigator.onLine) {
            return options.warning({ type: 'warning', text: 'Network is disconnect' });
        }

        if ('string' !== typeof options.method) {
            return options.warning({
                type: 'warning',
                text: 'XHR method is required ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "PATCH"]'
            });
        }

        if (options.method.toUpperCase() === 'GET' && options.url.indexOf('?') === -1 && options.data) {
            options.url = options.url + '?' + JSON.queryStringify(options.data);
        }

        if (options.data && ['array', 'object'].indexOf(getDataType(options.data)) !== -1) {
            options.data = JSON.stringify(options.data);
        }

        var request = new XMLHttpRequest();

        if (options.responseType) {
            request.responseType = options.responseType;
        }

        if (options.method.toUpperCase() === 'POST') {
            request.upload.onprogress = function (e) {
                options.progress(e);
            };

            request.onprogress = function (e) {
                options.progress(e);
            };
        }

        request.open(options.method, options.url, ((!options.async) 
            ? true 
            : options.async));
        
        if (options.timeout) {
            request.timeout = +(options.timeout);

            request.ontimeout = function (e) {
                options.error({ Error: 'timeout' });
            };
        }

        if (options.headers) {
            for (var key in options.headers) {
                request.setRequestHeader(key, options.headers[key], false);
            }
        }

        request.send(options.data);

        request.onload = function () {
            if (request.readyState === 4 && request.status === 200) {
                var requestResponse = !isValidJSON(request.responseText) 
                    ? request.responseText 
                    : JSON.parse(request.responseText);

                options.success(requestResponse, request);
            } 

            else if (request.readyState === 4 && [400, 401, 0, 404, 403].indexOf(request.status) !== -1) {
                var errorResponse = !isValidJSON(request.responseText) 
                    ? request.responseText 
                    : JSON.parse(request.responseText);

                options.error(errorResponse);
            } 

            else {
                options.warning();
            }
        };

        request.onerror = options.error;

        return request;
    }

}