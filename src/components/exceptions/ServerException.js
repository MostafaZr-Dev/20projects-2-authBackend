const ExceptionHandler = require("./ExceptionHandler");

class ServerException extends ExceptionHandler {
  constructor(message) {
    super(500, message);
  }
}

module.exports = ServerException;
