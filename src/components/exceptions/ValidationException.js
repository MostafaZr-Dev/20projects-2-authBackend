const ExceptionHandler = require("./ExceptionHandler");

class ValidationException extends ExceptionHandler {
  constructor(message) {
    super(422, message);
  }
}

module.exports = ValidationException;
