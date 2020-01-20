module.exports.validationError = (res, error = 'Data provided is not valid') => {
    addHeaders(res);

    res.statusCode = 422;
    res.end(JSON.stringify({ status: 'fail', error }, null, 3));
};

module.exports.error = (res, error = 'An unknown error occurred', statusCode = 500) => {
    addHeaders(res);

    res.statusCode = statusCode;
    res.end(JSON.stringify({ status: 'fail', error }, null, 3));
};

module.exports.success = (res, data = null) => {
    addHeaders(res);

    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'success', data }, null, 3));
};

module.exports.static = (res, data, statusCode = 200) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');

    res.statusCode = statusCode;
    res.end(data);
};

module.exports.notfound = (res, error = 'Page Not Found', statusCode = 404) => {
    res.statusCode = statusCode;
    res.end();
};

const addHeaders = (res) => {
    return res.setHeader('Content-Type', 'application/json');
};