const ErrorHander = require('../utils/errorhander');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong';

    //Mongodb ID error
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.path}`;
        err = new ErrorHander(message, 400);
    }

    //Mongodb duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        err = new ErrorHander(message, 400);
    }

    //wrong jwt token error
    if (err.name === 'JsonWebTokenError') {
        const message = `Invalid token, please try again`;
        err = new ErrorHander(message, 400);
    }

    //jwt expire error
    if (err.name === 'TokenExpiredError') {
        const message = `Token expired, please login again`;
        err = new ErrorHander(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}