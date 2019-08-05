// Entry point of the application
import express, { Application } from "express";
import compression from "compression";
import lusca from "lusca";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import SocketIO from "socket.io";
import RedisIO from "socket.io-redis";
import logger from "./logger";
import route from "./route";
import {
  PORT,
  TIGER_REDIS_SERVER,
  TIGER_REDIS_PORT,
  TIGER_REDIS_PWD
} from "./config";
import { sessionOptions } from "./session/session-store";
import * as Prometheus from "./prometheus/prometheus";
import { configureSocketIO } from "./route/mqscaffold";

const app: Application = express();

// App Setup
app.use(
  morgan("combined", {
    skip: function(_req, res) {
      return res.statusCode < 400;
    }
  })
);
app.set("trust proxy", 1);
app.use(helmet());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(session(sessionOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing setup
route(app);

// SocketIO setup
const io = SocketIO();
io.adapter(
  RedisIO({
    host: TIGER_REDIS_SERVER,
    port: TIGER_REDIS_PORT as number,
    auth_pass: TIGER_REDIS_PWD
  })
);
configureSocketIO(io);

// Start http server.
const server = app.listen(PORT, () => {
  return logger.info("App is listening on port", PORT);
});
// Attach server to socket io.
io.attach(server);

// Prometheus Setup
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();
