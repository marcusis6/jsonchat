import winston from "winston";
import path from "path";

const ChatRoom_NodeJs_V2_format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level} ${info.filename}: ${info.message} ${
        info.stack ? info.stack : ""
      }`
  )
);

const logger = winston.createLogger({
  level: "info",
  format: ChatRoom_NodeJs_V2_format,
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `ChatRoom_NodeJs_V2.log`
    //
    new winston.transports.File({
      filename: "ChatRoom_NodeJs_V2-error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "ChatRoom_NodeJs_V2.log" }),
  ],
});

//
// If we're not in production then log to the `console`
//

if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: ChatRoom_NodeJs_V2_format,
      level: "debug",
    })
  );
}

export default function (filename: string) {
  return logger.child({ filename: path.basename(filename) });
}
