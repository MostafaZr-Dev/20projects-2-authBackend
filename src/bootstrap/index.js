const express = require("express");
const cors = require("cors");

const corsOptions = {
  origin: "http://127.0.0.1:5500/",
};

module.exports = (app) => {
  app.use(cors());
  app.use(express.json());
};
