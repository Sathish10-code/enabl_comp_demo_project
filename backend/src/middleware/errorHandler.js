const logger = require('../utils/logger');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    logger.error('Request failed', {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        stack: env.nodeEnv === 'development' ? err.stack : undefined
    });

    // PostgreSQL unique violation
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Resource already exists' });
    }
    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        return res.status(400).json({ error: 'Referenced resource does not exist' });
    }

    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error'
    });
}

module.exports = { errorHandler };