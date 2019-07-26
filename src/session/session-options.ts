import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import logger from "../logger";
import {
  TIGER_SESSION_SECRET,
  TIGER_REDIS_HOST,
  TIGER_REDIS_PORT,
  TIGER_REDIS_PWD,
  TIGER_PRE_RELEASE
} from "../config";

const redisClient = redis.createClient({
  host: TIGER_REDIS_HOST,
  port: TIGER_REDIS_PORT as number,
  password: TIGER_REDIS_PWD
});
redisClient.on("error", (err) => {
  logger.error("Redis Error", err);
});
const redisStore = connectRedis(session);
const store = new redisStore({
  host: TIGER_REDIS_HOST,
  port: TIGER_REDIS_PORT as number,
  pass: TIGER_REDIS_PWD,
  client: redisClient
});

const sessionOptions: session.SessionOptions = {
  secret: TIGER_SESSION_SECRET,
  name: "session",
  cookie: {
    maxAge: 30 * 60 * 100 /* 30 minutes */,
    secure: true
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: store
};

if (TIGER_PRE_RELEASE) {
  (sessionOptions.cookie as any).secure = false;
}
export default sessionOptions;
