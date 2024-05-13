import { createLogger, transports, format } from 'winston';

const { combine, errors, json, colorize, simple, prettyPrint } = format;

export const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    colorize({ all: true }),
    simple(),
    json(),
    errors({ stack: true }),
    prettyPrint()
  ),
});
