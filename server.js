require("dotenv").config();
const runApp = require("./src/app");

const port = process.env.APP_PORT || 5000;

runApp(port);
