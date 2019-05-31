// Main starting point of the application
import express, { Application, Request, Response } from "express";
import compression from "compression";
import lusca from "lusca";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import logger from "./util/logger";
import router from "./router";
import * as Prometheus from "./util/prometheus";

// ENV Setup
dotenv.config({ path: ".env" });

const app: Application = express();

// App Setup
app.use(helmet());
app.use(morgan("combined"));
app.use(session({secret: "abc", name: "session"}));
app.use(compression());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
// app.use(bodyParser.json({ type: "*/*" }));
app.use(bodyParser.urlencoded({ extended: true }));
router(app);

// Server Setup
const PORT = process.env.PORT;
app.listen(PORT, (err: any) => {
  if (err) {
    return logger.error(err);
  }
  return logger.info("App is listening on port", PORT);
});

// Prometheus Setup
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();