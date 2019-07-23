import { Application, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import logger from "../util/logger";
import { SessionInfo } from "../util/parse-saml-xml";
import { STATIC_CDN_PATH } from "../config";
import authRoute from "./auth/auth-route";
import htmlLoader from "../util/html-loader";

export default function route(app: Application) {
  authRoute(app);

  app.get("/api", (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Express.Session;
    const info = session.info as SessionInfo;
    if (info) {
      res.send(info);
      const { source, method, requestType, path, data } = req.body;
      // TODO: interact with backend api
    } else {
      res.sendStatus(401);
    }
  });

  app.get("/need-to-update-browser", (req: Request, res: Response) => {
    fs.readFile(
      path.resolve(__dirname, "../static/update-browser.html"),
      (err, file) => {
        const newFile = file.toString("utf8");
        res.set("Content-Type", "text/html; charset=utf-8");
        res.status(200).end(newFile);
      }
    );
  });

  app.get("*", (req: Request, res: Response) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    htmlLoader
      .get(STATIC_CDN_PATH + "/index.html")
      .then((source) => {
        res.status(200).end(source);
      })
      .catch((err) => {
        logger.error(err);
      });
  });
}
