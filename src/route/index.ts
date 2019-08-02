import { Application, Request, Response } from "express";
import request from "request-promise";
import authRoute from "./auth-route";
import apiRoute from "./api-route";
import staticRoute from "./content-route";
import mqscaffoldRoute from "./mqscaffold-route";
import logger from "../logger";
import { STATIC_CDN_PATH } from "../config";

export default function route(app: Application) {
  apiRoute(app);
  authRoute(app);
  mqscaffoldRoute(app);
  staticRoute(app);

  app.get("/*", (req: Request, res: Response) => {
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
