import { createLogger, transports, format, addColors } from 'winston';

const { combine, timestamp, json, simple, colorize, label, printf } = format;

// const formatter = format((info) => {
//   const { message, timestamp, label, level } = info;

//   info.message = ` ${label} ${timestamp}  ${level} : ${message}`;
//   delete info.timestamp;
//   delete info.label;
//   return info;
// });

export const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    label({
      label: '[LOGGER]',
    }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    json(),
    simple(),
    colorize({ all: true }),
    printf(
      (info) =>
        ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
    )
  ),
});

addColors({
  info: 'bold blue', // fontStyle color
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green',
});
