// src/middlewares/errorHandler.middleware.js
const Response = require("../utils/Response");
const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error(err);

  const response = Response.error(err);

  res.status(response.code || 500).json({
    success: false,
    ...response,
  });
}

module.exports = errorHandler;
