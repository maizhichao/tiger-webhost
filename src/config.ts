const {
  GUARD_UI_HOST = "https://passport-pft.energymost.com/",
  TIGER_HOST: HOST = "http://localhost",
  TIGER_SESSION_SECRET = "P@ssw0rd",
  TIGER_SESSION_MAX_AGE = 10000,
  STATIC_CDN_PATH = "https://se-test-static.energymost.com/test/module",
  TIGER_REDIS_SERVER: TIGER_REDIS_HOST = "r-bp15cb1344506784.redis.rds.aliyuncs.com",
  TIGER_REDIS_PORT = 6379,
  TIGER_REDIS_PWD = "NmP6HpG5N7gkY"
} = process.env;

const PORT = 8888;
const DEFAULT_SP = "sp1";
const WEB_HOST = HOST + ":" + PORT;
const STATIC_PATH = __dirname + "/static";
export {
  GUARD_UI_HOST,
  DEFAULT_SP,
  PORT,
  TIGER_SESSION_SECRET,
  TIGER_SESSION_MAX_AGE,
  WEB_HOST,
  STATIC_PATH,
  STATIC_CDN_PATH,
  TIGER_REDIS_HOST,
  TIGER_REDIS_PORT,
  TIGER_REDIS_PWD
};
