"use strict";
// import { createLogger, format, transports } from "winston";
// // import DailyRotateFile from 'winston-daily-rotate-file'; 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { combine, timestamp, json, colorize } = format;
// const consoleLogFormat = format.combine(
//   format.colorize(),
//   format.printf(({ level, message, timestamp }) => {
//     return `${level}: ${message}`;
//   })
// );
// const logger = createLogger({
//   level: "info",
//   format: combine(colorize(), timestamp(), json()),
//   transports: [
//     new transports.Console({
//       format: consoleLogFormat,
//     }),
//     new transports.File({ filename: "app.log" }),
//   ],
// });
// export default logger;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, json, colorize } = winston_1.format;
const consoleLogFormat = winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
}));
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp(), json()),
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: "logs/%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "1d",
            format: json()
        }),
        new winston_1.transports.Console({
            format: consoleLogFormat,
        }),
        new winston_1.transports.File({ filename: "app.log" }),
    ],
});
exports.default = logger;
