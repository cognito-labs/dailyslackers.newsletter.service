
/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
    dotenv.config({ path: '.env.default' });
}

import app from './app'

import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './logger';

const PORT = process.env.PORT || 3000;

let debugCallback;
if (process.env.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
    const message = `${collectionName}.${method}(${query})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
    mongoUrl: process.env.MONGO_URL ?? '',
    mongooseConnectionOptions: {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS
    },
    debugCallback,
    onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
    onConnectionError: (error, mongoUrl) => logger.log({
        level: 'error',
        message: `Could not connect to MongoDB at ${mongoUrl}`,
        error
    }),
    onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
});


// start the Express server
const serve = () => app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);

    if (process.env.NODE_ENV === 'development') {
      // This route is only present in development mode
      // logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`);
    }
});


if (process.env.MONGO_URL == null) {
    logger.error('MONGO_URL not specified in environment', new Error('MONGO_URL not specified in environment'));
    process.exit(1);
} else {
    safeMongooseConnection.connect(mongoUrl => {
        logger.info(`Connected to MongoDB at ${mongoUrl}`);
        serve();
    });
}