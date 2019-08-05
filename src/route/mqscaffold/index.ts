import amqp, { Message } from "amqplib/callback_api";
import { TIGER_RABBITMQ_URL, SID_NAME } from "../../config";
import cookieParser from "cookie";
import logger from "../../logger";
import _ from "lodash";
import { sessionStore } from "../../session/session-store";
import { MQSubscribe } from "./mq-subscription";
import handleWebConnection from "./connection/web";

async function validateSession(socket: SocketIO.Socket) {
  return new Promise((resolve, reject) => {
    const sessionId = cookieParser.parse(socket.handshake.headers.cookie)[
      SID_NAME
    ];
    if (!sessionId) {
      return;
    }
    sessionStore.get(sessionId, (err, session) => {
      if (err) {
        reject(err);
      }
      resolve(session);
    });
  });
}

export function configureSocketIO(io: SocketIO.Server) {
  io.of("web").on("connect", async (socket) => {
    try {
      await validateSession(socket);
      handleWebConnection(socket);
    } catch (err) {
      logger.error("[web] namespace sockect connection error", err);
    }
  });

  io.of("mobile").on("connect", async (socket) => {
    try {
      await validateSession(socket);
      // TODO:
    } catch (err) {
      logger.error("[mobile] namespace sockect connection error", err);
    }
  });

  io.of("preference").on("connect", async (socket) => {
    try {
      await validateSession(socket);
      // TODO:
    } catch (err) {
      logger.error("[preference] namespace sockect connection error", err);
    }
  });
}
