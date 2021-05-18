const EexceptionHandler = require("./ExceptionHandler");
const NotFoundHandler = require("./NotFoundHandler");

const errorHandler = (app) => {
  app.use(EexceptionHandler);
  app.use(NotFoundHandler);
};

module.exports = errorHandler;
