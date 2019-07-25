// Main starting point of the application
import express, { Application } from "express";
import compression from "compression";
import lusca from "lusca";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import logger from "./logger";
import router from "./router";
import cors from "cors";
import { PORT, TIGER_CORS } from "./config";
import sessionOptions from "./session/session-options";
import * as Prometheus from "./prometheus/prometheus";

const app: Application = express();

// App Setup
app.set("trust proxy", 1);

if (TIGER_CORS) {
  app.use(cors());
}
app.use(helmet());
app.use(
  morgan("combined", {
    skip: function(_req, res) {
      return res.statusCode < 400;
    }
  })
);
app.use(session(sessionOptions));
app.use(compression());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(bodyParser.json());
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
