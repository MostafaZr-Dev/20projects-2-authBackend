const ExceptionHandler = require("./ExceptionHandler");

class ConfilictException extends ExceptionHandler {
  constructor(message) {
    super(409, message);
  }
}

module.exports = ConfilictException;
