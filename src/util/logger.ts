import winston from "winston";
import { createLogger } from "winston";

const logger = createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug"
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
