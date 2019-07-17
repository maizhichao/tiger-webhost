import { Application, Request, Response, NextFunction } from "express";
import logger from "../util/logger";
import { SamlInfo, parseSamlXml } from "../util/parse-saml-xml";

export default function route(app: Application) {
  app.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      const info = await parseSamlXml(req.body.SAMLResponse);
      const session = req.session as Express.Session;
      session.info = info;
      res.send({ Result: info });
    }
  );

  app.get("/logout", (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Express.Session;
    const info = session.info as SamlInfo;
    if (info) {
      session.destroy(() => {
        logger.info(`${info.Name} is logged out.`);
      });
      res.send(`${info.Name} is logged out.`);
    } else {
      res.send("Already logged out.");
    }
  });

  // TODO:
  app.post("/api", (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as Express.Session;
    const info = session.info as SamlInfo;
    if (info) {
      res.send(`${info.Name} is logged out.`);
    } else {
      const { source, method, requestType, path, data } = req.body;
    }
  });

  // TODO: just a test
  app.get("/", (req: Request, res: Response) => {
    const session = req.session as Express.Session;
    if (session.info) {
      const info = session.info as SamlInfo;
      res.send("Hello " + info.Name);
    } else {
      res.send("Not allowed");
    }
  });
}
