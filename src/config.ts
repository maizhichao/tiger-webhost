const {
  GUARD_UI_HOST = "https://passport-pft.energymost.com/",
  TIGER_HOST: HOST = "http://localhost",
  TIGER_SESSION_SECRET = "P@ssw0rd",
  TIGER_SESSION_MAX_AGE = 10000,
  STATIC_CDN_PATH = "http://localhost:4000"
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
  STATIC_CDN_PATH
};
