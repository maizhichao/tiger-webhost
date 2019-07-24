import { Application, Request, Response, NextFunction } from "express";
import request from "request-promise";
import fs from "fs";
import path from "path";
import logger from "../util/logger";
import { SessionInfo } from "../util/parse-saml-xml";
import { STATIC_CDN_PATH } from "../config";
import authRoute from "./auth/auth-route";

export default function route(app: Application) {
  authRoute(app);

  app.get("/api", (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Express.Session;
    const info = session.info as SessionInfo;
    if (!info) {
      res.sendStatus(401);
      return;
    }
    const { source, method, requestType, path, data } = req.body;
    // TODO: interact with backend api
    const options = {
      method: "GET",
      uri: "http://t-cc.hz.ds.se.com/api/user/GetUserById/100107",
      json: true,
      headers: {
        Accept: "application/json"
      },
      resolveWithFullResponse: true
    };
    request(options)
      .then((ret) => {
        res.send(ret);
      })
      .catch((err) => {
        logger.error(err);
        res.send(err);
      });
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
    request(STATIC_CDN_PATH + "/Panda/index.html")
      .then((html) => {
        res.set("Content-Type", "text/html; charset=utf-8");
        res.status(200).end(html);
      })
      .catch((err) => {
        logger.error(err);
        res.sendStatus(404);
      });
  });
}
