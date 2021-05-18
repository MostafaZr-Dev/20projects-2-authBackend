const express = require("express");

const userRouter = require("../components/user/router");

const router = express.Router();

router.use("/user", userRouter);

module.exports = router;
