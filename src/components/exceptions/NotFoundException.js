const ExceptionHandler = require("./ExceptionHandler");

class NotFoundHandler extends ExceptionHandler {
  constructor(message) {
    super(404, message);
  }
}

module.exports = NotFoundHandler;
