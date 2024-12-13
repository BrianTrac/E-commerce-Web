const e = require('express');
const { logEvents } = require('./logEvents.middleware');

const errorHandler = async (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errorLogs.txt');
    res.status(500).send( err.message );
};

module.exports = errorHandler;