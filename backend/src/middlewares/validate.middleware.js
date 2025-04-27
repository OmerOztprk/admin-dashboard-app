// src/middlewares/validate.middleware.js
const { ValidationError } = require("yup");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");

function validate(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.join(", ");
        next(new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", messages));
      } else {
        next(error);
      }
    }
  };
}

module.exports = validate;
