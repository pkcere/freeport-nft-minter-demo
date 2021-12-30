const winston = require('winston');

const createLogger = () => {
    const { combine, timestamp, label, printf } = winston.format;

    const myFormat = printf(({ level, message, label, timestamp }) => {
      return `[${timestamp}] - ${message}`;
    });

    const logger = winston.createLogger({
      level: 'info',
      format: combine(timestamp(),myFormat),
      transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
    return logger;
};

module.exports = createLogger;
const str2ByteArr = (str) => {
    const arr = [];
    for (let i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    return arr;
};

module.exports = {
	createLogger,
	str2ByteArr
}