const Enum = require("../config/Enum");
const CustomError = require("./CustomError");
const i18n = require("./i18n");

class Response {
  static success(data, code = Enum.HTTP_CODES.OK) {
    return {
      code,
      data
    };
  }

  static error(error, lang = "EN") {
    console.error("❌", error);

    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          description: error.description
        }
      };
    }

    if (error.message?.includes("E11000")) {
      return {
        code: Enum.HTTP_CODES.CONFLICT,
        error: {
          message: i18n.translate("COMMON.ALREADY_EXIST", lang),
          description: i18n.translate("COMMON.ALREADY_EXIST", lang)
        }
      };
    }

    return {
      code: Enum.HTTP_CODES.INT_SERVER_ERROR,
      error: {
        message: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
        description: error.message
      }
    };
  }
}

module.exports = Response;
