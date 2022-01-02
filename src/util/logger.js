const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
require("winston-daily-rotate-file");

const root = process.cwd();
const ENV = process.env.APP_ENV;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// 7 level of log, from most important to less important
// { error | warn | info | http | verbose | debug | silly }
const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS ZZ",
    }),
    myFormat
  ),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs `combined.log`
    new transports.DailyRotateFile({
      filename: path.join(`${root}/logs`, "%DATE%-error.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "7d",
    }),
    new transports.DailyRotateFile({
      filename: path.join(`${root}/logs`, "%DATE%-combined.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d",
    }),
  ],
});

if (ENV == "prd") {
  // If we're in production then log to the `console` with level 'info' or above
  logger.add(
    new transports.Console({
      level: "info",
    })
  );
} else {
  // If we're not in production then log to the `console` with level 'debug' or above
  logger.add(
    new transports.Console({
      level: "debug",
    })
  );
}

module.exports = function () {
  return logger;
};
