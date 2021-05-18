const ExceptionHandler = require("./ExceptionHandler");

class UnAuthorizeException extends ExceptionHandler {
  constructor(message) {
    super(401, message);
  }
}

module.exports = UnAuthorizeException;
