class CustomError extends Error {
  constructor(code, message, description) {
    super(description || message);
    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    this.description = description || message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
