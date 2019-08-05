import { Application, Request, Response } from "express";
import fs from "fs";
import { URL } from "url";
import { ServiceProvider, IdentityProvider } from "samlify";
import {
  GUARD_UI_HOST,
  DEFAULT_SP,
  STATIC_PATH,
  WEB_HOST,
  SID_NAME
} from "../../config";
import { SessionInfo, parseSamlXml } from "./parse-saml-xml";
import logger from "../../logger";

const PRODUCTION = process.env.NODE_ENV === "production";
const sso = {
  privateKey: fs.readFileSync(STATIC_PATH + "/SE-SP.pem"),
  privateKeyPass: "sesp!@#",
  metadataSp: fs.readFileSync(STATIC_PATH + "/metadata_sp.xml", "utf-8"),
  metadataOneLogin: fs.readFileSync(
    STATIC_PATH + "/onelogin_metadata.xml",
    "utf-8"
  )
};

const extractSpDomain = PRODUCTION
  ? ({ hostname }: Request) => hostname.split(".")[0] || ""
  : () => DEFAULT_SP;

export default function authRoute(app: Application) {
  app.get("/:lang/login", (req: Request, res: Response) => {
    try {
      const { sysId } = req.query;
      const { referer } = req.headers;
      const lang = req.params.lang;
      const spDomain = extractSpDomain(req);
      const ssoAcsURL = `${WEB_HOST}/${lang}/sso/acs?callbackURL=${referer}`;
      const sp = ServiceProvider({
        privateKey: sso.privateKey,
        privateKeyPass: sso.privateKeyPass,
        metadata: sso.metadataSp.replace("${SSO_ACS_URL}", ssoAcsURL)
      });
      const idp = IdentityProvider({
        metadata: sso.metadataOneLogin
          .split("${GUARD_UI_HOST}")
          .join(GUARD_UI_HOST + "Saml/SignOnService")
      });
      const url = sp.createLoginRequest(idp, "redirect");
      const redirectURL = new URL(url.context);
      redirectURL.pathname = lang + redirectURL.pathname;
      return res.redirect(
        redirectURL.href +
          "&callbackURL=" +
          encodeURIComponent(referer as string) +
          "&sysId=" +
          sysId +
          "&spDomain=" +
          encodeURIComponent(spDomain)
      );
    } catch (e) {
      res.sendStatus(404);
    }
  });

  app.post("/:lang/sso/acs", async (req: Request, res: Response) => {
    const { callbackURL } = req.query;
    try {
      const info = await parseSamlXml(req.body.SAMLResponse);
      const session = req.session as Express.Session;
      session.info = info;
      res.cookie(SID_NAME, session.id);
      res.redirect(callbackURL);
    } catch (err) {
      logger.error("Failed to login:", err);
      res.redirect(callbackURL);
    }
  });

  app.get("/:lang/logout", (req: Request, res: Response) => {
    const session = req.session as Express.Session;
    const info = session.info as SessionInfo;
    session.destroy(() => {
      logger.info(info && `${info.Name} is logged out.`);
    });
    return res.redirect(
      GUARD_UI_HOST +
        req.params.lang +
        "/logout?returnURL=" +
        encodeURIComponent(req.query.returnURL)
    );
  });

  app.get("/:lang/changepwd", (req: Request, res: Response) => {
    const spDomain = extractSpDomain(req);
    const { userName, returnUrl, sysId } = req.query;
    const urlEncoded = encodeURIComponent(returnUrl);
    const { lang } = req.params;
    const toURL = `${GUARD_UI_HOST}${lang}/set-password?sysId=${sysId}&spDomain=${spDomain}&userName=${userName}&returnUrl=${urlEncoded}`;
    return res.redirect(toURL);
  });
}
