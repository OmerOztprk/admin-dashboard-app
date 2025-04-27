require("dotenv").config();

module.exports = Object.freeze({
  PORT: process.env.PORT || 5000,
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME || "1d",
  },
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  DEFAULT_LANG: process.env.DEFAULT_LANG || "TR",
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || "./uploads",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  MAIL: {
    USER: process.env.MAIL_USER,
    PASS: process.env.MAIL_PASS,
    FROM: process.env.MAIL_FROM,
  },
  AIFLOW_URL: process.env.AIFLOW_URL,
});
