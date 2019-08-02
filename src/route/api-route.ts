import { Application, Request, Response, NextFunction } from "express";
import request from "request-promise";
import { SessionInfo } from "./auth-route/parse-saml-xml";
import { SourceMap } from "../source-map";
import logger from "../logger";

export default function apiRoute(app: Application) {
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
        "X-Session": info
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
}
