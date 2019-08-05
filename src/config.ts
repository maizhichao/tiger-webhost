const {
  GUARD_UI_HOST = "https://passport-pft.energymost.com/",
  TIGER_HOST,
  TIGER_SESSION_SECRET = "P@ssw0rd",
  TIGER_SESSION_MAX_AGE = 10000,
  STATIC_CDN_PATH = "https://se-test-static.energymost.com/test/module",
  TIGER_RABBITMQ_URL = "amqp://user1:password@172.26.66.4",
  TIGER_REDIS_SERVER = "r-bp15cb1344506784.redis.rds.aliyuncs.com",
  TIGER_REDIS_PORT = 6379,
  TIGER_REDIS_PWD = "NmP6HpG5N7gkY",
  PORT = 8888
} = process.env;

const DEFAULT_SP = "tiger";
const WEB_HOST =
  process.env.NODE_ENV === "production"
    ? `https://${TIGER_HOST}`
    : `http://localhost:${PORT}`;
const STATIC_PATH = __dirname + "/static";
const SID_NAME = "sid";

export {
  GUARD_UI_HOST,
  DEFAULT_SP,
  PORT,
  TIGER_SESSION_SECRET,
  TIGER_SESSION_MAX_AGE,
  WEB_HOST,
  STATIC_PATH,
  STATIC_CDN_PATH,
  TIGER_RABBITMQ_URL,
  TIGER_REDIS_SERVER,
  TIGER_REDIS_PORT,
  TIGER_REDIS_PWD,
  SID_NAME
};
