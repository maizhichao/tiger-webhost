import axios from "axios";
import logger from "./logger";

const htmlLoader = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "text/html",
    Accept: "text/html",
    "cache-control": "no-cache",
    cache: "no-cache"
  },
  method: "GET",
  data: {}
});

htmlLoader.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    logger.error(err);
  }
);

export default htmlLoader;
