import { SourceProxyConfig } from "./../source-map";
import { Application } from "express";
import http from "http";
import proxy from "http-proxy-middleware";
import { UserInfo } from "./auth-route/model";
import { SourceMap } from "../source-map";

const API_PREFIX = "/proxy";

function registerProxy(
  app: Application,
  apiPrefix: string,
  source: string,
  sourceProxyConfig: SourceProxyConfig
) {
  const path = `${apiPrefix}/${source}`;
  const pathPattern = `^${path}`;
  app.use(
    path,
    proxy({
      target: sourceProxyConfig.target,
      changeOrigin: true,
      pathRewrite: {
        [pathPattern]: ""
      },
      proxyTimeout: 20000,
      onError: (err, req, res) => {
        res.writeHead(500, {
          "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(err));
      },
      onProxyReq: (
        proxyReq: http.ClientRequest,
        req: http.IncomingMessage,
        res: http.ServerResponse
      ) => {
        // req.session.info's existance is guaranteed.
        proxyReq.setHeader("X-Session", (req as any).session.info);
      }
    })
  );
}

function proxify(app: Application, apiPrefix: string) {
  app.use(apiPrefix, (req, res, next) => {
    const session = req.session as Express.Session;
    const sessionInfo = session.info as UserInfo;
    if (!sessionInfo) {
      res.sendStatus(401);
      return;
    }
    next();
  });

  Object.entries(SourceMap).forEach((sourceInfo) =>
    registerProxy(app, apiPrefix, ...sourceInfo)
  );
}

export default function apiProxy(app: Application) {
  proxify(app, API_PREFIX);
}
