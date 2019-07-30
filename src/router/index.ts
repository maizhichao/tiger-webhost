import { Application, Request, Response, NextFunction } from "express";
import request from "request-promise";
import fs from "fs";
import path from "path";
import logger from "../logger";
import { SourceMap } from "../source-map";
import { SessionInfo } from "./auth/parse-saml-xml";
import { STATIC_CDN_PATH } from "../config";
import authRoute from "./auth/auth-route";

export default function route(app: Application) {
  authRoute(app);

  app.post("/api", (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Express.Session;
    const info = session.info as SessionInfo;
    if (!info) {
      res.sendStatus(401);
      return;
    }
    const { source, url, method = "GET", data } = req.body;
    const target = SourceMap[source];
    if (!target || !url) {
      res.status(400).send("Bad request: Missing [source] or [url] definition");
    }
    request({
      method: method,
      uri: target + url,
      body: {
        ...data
      },
      headers: {
        Accept: "application/json",
        session: info
      },
      json: true
    })
      .then((ret) => {
        res.send(ret);
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send(err);
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
