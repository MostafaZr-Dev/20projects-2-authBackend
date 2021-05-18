const express = require("express");

const userController = require("./controller");
const userMiddlewares = require("./middlewares");

const router = express.Router();

router.get("/init", userMiddlewares.verifyToken, userController.init);

router.post(
  "/create",
  userMiddlewares.validateRegisterData,
  userMiddlewares.validtor,
  userMiddlewares.checkUserExist,
  userController.create
);

router.post(
  "/auth",
  userMiddlewares.validateAuthData,
  userMiddlewares.validtor,
  userController.authenticate
);

router.post(
  "/forgot-password",
  userMiddlewares.validateEmail,
  userMiddlewares.validtor,
  userController.forgotPassword
);

router.post("/password-reset/validate", userController.checkResetToken);

router.post(
  "/password-reset/change",
  userMiddlewares.checkValidToken,
  userMiddlewares.validateResetData,
  userMiddlewares.validtor,
  userController.changePassword
);

module.exports = router;
