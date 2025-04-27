module.exports = Object.freeze({
  HTTP_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  PASS_LENGTH: 8,
  ADMIN: "ADMIN",

  LOG_LEVELS: Object.freeze({
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
    DEBUG: "DEBUG",
    VERBOSE: "VERBOSE",
    HTTP: "HTTP",
  }),
});
