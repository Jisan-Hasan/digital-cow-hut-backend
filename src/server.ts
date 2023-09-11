/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';

let server: Server;
process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

async function boostrap() {
  try {
    await mongoose.connect(config.database_url as string);
    // logger.info(`🗄️ Database is connected successfully`);
    console.log(`🗄️ Database is connected successfully`);

    server = app.listen(config.port, () => {
      // logger.info(`App is listening on port ${config.port}`);
      console.log(`App is listening on port ${config.port}`);
    });
  } catch (error) {
    // errorLogger.error(`Failed to connect database`, error);
    console.error(`Failed to connect database`, error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

boostrap();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
