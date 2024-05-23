import { createLogger, transports, format, addColors } from 'winston';

const { combine, timestamp, json, simple, colorize, label, printf } = format;

const formatDebugger = format((info) => {
  if (info.data) {
    info.message = `${JSON.stringify(info.data)}`;
    delete info.data;
  }
  return info;
});

export const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    label({
      label: '[LOGGER]',
    }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    formatDebugger(),
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
