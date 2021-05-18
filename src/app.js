const express = require("express");

const appRouter = require("./router/router");
const bootApp = require("./bootstrap");
const errorHandler = require("./middlewares/error-handler");

const app = express();

bootApp(app);

app.use("/api/v1", appRouter);

errorHandler(app);

const runApp = (port) => {
  app.listen(port, () => {
    console.log(`App runnig on http://localhost:${port}...`);
  });
};

module.exports = runApp;
