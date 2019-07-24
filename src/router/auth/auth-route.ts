import { Application, Request, Response, NextFunction } from "express";
import fs from "fs";
import { URL } from "url";
import { ServiceProvider, IdentityProvider } from "samlify";
import { GUARD_UI_HOST, DEFAULT_SP, STATIC_PATH, WEB_HOST } from "../../config";
import { SessionInfo, parseSamlXml } from "../../util/parse-saml-xml";
import logger from "../../util/logger";

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

const extractSpDomain = false
  ? ({ hostname }: Request) => hostname.split(".")[0] || ""
  : () => DEFAULT_SP;

export default function authRoute(app: Application) {
  app.get("/:lang/login", (req: Request, res: Response) => {
    try {
      const { callbackURL, sysId } = req.query;
      const lang = req.params.lang;
      const spDomain = extractSpDomain(req);
      const ssoAcsURL = `${WEB_HOST}/${lang}/sso/acs?callbackURL=${callbackURL}`;
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
          encodeURIComponent(callbackURL) +
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
      res.redirect(callbackURL);
    } catch (err) {
      res.redirect(callbackURL);
    }
  });

  app.get("/:lang/logout", (req: Request, res: Response) => {
    const session = req.session as Express.Session;
    const info = session.info as SessionInfo;
    if (info) {
      session.destroy(() => {
        logger.info(`${info.Name} is logged out.`);
      });
      return res.redirect(
        GUARD_UI_HOST +
          req.params.lang +
          "/logout?returnURL=" +
          encodeURIComponent(req.query.returnURL)
      );
    } else {
      res.redirect(req.query.returnURL);
    }
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
