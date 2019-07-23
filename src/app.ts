// Main starting point of the application
import express, { Application } from "express";
import compression from "compression";
import lusca from "lusca";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import redis from "redis";
import cors from "cors";
import connectRedis from "connect-redis";
import logger from "./util/logger";
import router from "./router";
import {
  TIGER_SESSION_SECRET,
  TIGER_REDIS_HOST,
  TIGER_REDIS_PORT,
  TIGER_REDIS_PWD,
  PORT
} from "./config";
import * as Prometheus from "./util/prometheus";

const app: Application = express();

// Session Setup
const sessionConfig: session.SessionOptions = {
  secret: TIGER_SESSION_SECRET,
  name: "session",
  cookie: { maxAge: 30 * 60 * 100 /* 30 minutes */ },
  rolling: true,
  resave: false,
  saveUninitialized: false
};
if (process.env.NODE_ENV === "production") {
  const redisClient = redis.createClient({
    host: TIGER_REDIS_HOST,
    port: TIGER_REDIS_PORT as number,
    password: TIGER_REDIS_PWD
  });
  redisClient.on("error", (err) => {
    logger.error("Redis Error", err);
  });
  const redisStore = connectRedis(session);
  const store = new redisStore({
    host: TIGER_REDIS_HOST,
    port: TIGER_REDIS_PORT as number,
    pass: TIGER_REDIS_PWD,
    client: redisClient
  });
  app.set("trust proxy", 1);
  sessionConfig.cookie = {
    ...sessionConfig.cookie,
    secure: true
  };
  sessionConfig.store = store;
}

// App Setup

app.use(helmet());
app.use(morgan("combined"));
app.use(session(sessionConfig));
app.use(compression());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(bodyParser.urlencoded({ extended: true }));
router(app);

// Server Setup
app.listen(PORT, (err: any) => {
  if (err) {
    return logger.error(err);
  }
  return logger.info("App is listening on port", PORT);
});

// Prometheus Setup
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();
