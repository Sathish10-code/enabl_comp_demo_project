const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
const logger = require('./utils/logger');
const siteRoutes = require('./routes/sites');
const installationRoutes = require('./routes/installations');
const summaryRoutes = require('./routes/summary');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

// Tiny request logger
app.use((req, _res, next) => {
    logger.info('Incoming request', { method: req.method, url: req.originalUrl });
    next();
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/sites', siteRoutes);
app.use('/api/installations', installationRoutes);
app.use('/api/summary', summaryRoutes);

app.use(notFound);
app.use(errorHandler);

// Only listen if run directly (so tests can import app)
if (require.main === module) {
    app.listen(env.port, () => {
        logger.info(`Server listening on port ${env.port}`);
    });
}

module.exports = app;