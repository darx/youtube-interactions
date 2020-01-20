const validationError = (res, error = 'Data provided is not valid') => {
    addHeaders(res);

    res.statusCode = 422;
    res.end(JSON.stringify({ status: 'fail', error }, null, 3));
};

const error = (res, error = 'An unknown error occurred', statusCode = 500) => {
    addHeaders(res);

    res.statusCode = statusCode;
    res.end(JSON.stringify({ status: 'fail', error }, null, 3));
};

const success = (res, data = null) => {
    addHeaders(res);

    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'success', data }, null, 3));
};

const static = (res, data, statusCode = 200) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');

    res.statusCode = statusCode;
    res.end(data);
};

const notfound = (res, error = 'Page Not Found', statusCode = 404) => {
    res.statusCode = statusCode;
    res.end();
};

const addHeaders = (res) => {
    return res.setHeader('Content-Type', 'application/json');
};

module.exports = { validationError, error, success, static, notfound };