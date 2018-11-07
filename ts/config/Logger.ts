import * as winston from 'winston';
import * as winstonError from 'winston-error';

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

winstonError(logger);

export default logger;
