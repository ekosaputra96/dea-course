function success(res, payload, message, statusCode = 200){
    res.status(statusCode).json({
        success: true,
        payload,
        message,
        statusCode
    }).end();
}

function error(res, message, url, statusCode) {
    res.status(statusCode).json({
        success: false,
        message: {
            message,
            url,
        },
        statusCode
    }).end()
}

class ValidateError extends Error {
    constructor(message, statusCode = 400){
        super(message);
        this.statusCode = statusCode,
        this.name = this.constructor.name
    }
}

function errorHanlder(err, req, res, next){
    if(err instanceof ValidateError){
        return error(res, err.message, req.originalUrl, err.statusCode);
    }

    return error(res, err.message, req.originalUrl, 500);
}

function notFoundHanlder(req, res, next) {
    return error(res, "Not Found", req.originalUrl, 404);
}

module.exports = {
    success,
    error,
    errorHanlder,
    notFoundHanlder,
    ValidateError
}