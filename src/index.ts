/* eslint-disable  @typescript-eslint/no-explicit-any */
import app from './app';
import config from './config/config';
import logger from './middleware/logger';
import mongoose from 'mongoose';

let server: any;
mongoose
  .connect(config.mongo_url, {
    dbName: 'eat-fit',
  })
  .then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(parseInt(config.port), () => {
      logger.log('info', `Server is running on Port: ${config.port}`);
    });
    return;
  })
  .catch((e) => {
    console.log(e, 'Mongo error');
  });

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing http server.');
  server.close((err: any) => {
    logger.info(err, 'Http server closed.');
    process.exit(err ? 1 : 0);
  });
});
