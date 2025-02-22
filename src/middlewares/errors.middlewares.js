const ErrorWithStatus = require('../models/Errors.model')
const _ = require('lodash')

const defaultErrorHandler = (err, req, res, next) => {
    if (err instanceof ErrorWithStatus) {
        return res.status(err.status).json(_.omit(err, ['status']))
    }

    Object.getOwnPropertyNames(err).forEach((key) => {
        Object.defineProperty(err, key, { enumerable: true });
      });

    return res.status(err.status || 500).json(
        {
            message: err.message || 'Something went wrong',
            status: err.status || 500,
        }
    )
}

module.exports = defaultErrorHandler

