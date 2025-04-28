const Enum = require("../config/Enum");
const CustomError = require("../utils/CustomError");
const i18n = require("../utils/i18n");

class Response {
  static success(data, code = Enum.HTTP_CODES.OK) {
    return { code, data };
  }

  static error(error, lang = "EN") {
    console.error("❌", error);

    if (error instanceof CustomError) {
      return {
        code: error.code || Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
        error: {
          message: error.message,
          description: error.description,
        },
      };
    }

    if (error.message?.includes("E11000")) {
      return {
        code: Enum.HTTP_CODES.CONFLICT,
        error: {
          message: i18n.translate("COMMON.ALREADY_EXIST", lang),
          description: i18n.translate("COMMON.ALREADY_EXIST", lang),
        },
      };
    }

    return {
      code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
      error: {
        message: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
        description: error.message || "Unexpected error",
      },
    };
  }
}

module.exports = Response;
