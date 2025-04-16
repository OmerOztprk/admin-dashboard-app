require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  CONNECTION_STRING: process.env.CONNECTION_STRING || "mongodb://localhost:27017/admin-panel",
  JWT: {
    SECRET: process.env.JWT_SECRET || "secret-key",
    EXPIRE_TIME: parseInt(process.env.TOKEN_EXPIRE_TIME) || 86400
  },
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  DEFAULT_LANG: process.env.DEFAULT_LANG || "EN",
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || "./src/uploads"
};
