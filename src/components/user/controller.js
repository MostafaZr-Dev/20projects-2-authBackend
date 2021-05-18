const userService = require("./services");
const hashService = require("../../services/hash");
const tokenService = require("../../services/token");
const notificationService = require("../../services/notification");
const userTransformer = require("./transformer");
const ServerException = require("../exceptions/ServerException");
const UnAuthorizeException = require("../exceptions/UnAuthorizeException");

const { FRONT_URL } = process.env;

exports.init = async (req, res, next) => {
  try {
    const userID = req.userID;

    const user = await userService.getUserBy("user_id", userID);

    if (user.error) {
      throw new ServerException("Something went wrong. try again");
    }

    if (!user.success) {
      return res.status(422).send({
        success: false,
        message: "Something went wrong. try again",
      });
    }

    const userData = userTransformer.getUserData(user.data);

    res.send({
      success: true,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    const userID = hashService.generateID();
    const hashedPassword = hashService.hashPassword(password);

    const result = await userService.create([
      userID,
      firstname,
      lastname,
      email,
      phone,
      hashedPassword,
    ]);

    if (result.error) {
      throw new ServerException("something went wrong! try again...");
    }

    if (!result.success) {
      return res.status(422).send({
        success: false,
        message: "something went wrong! try again...",
      });
    }

    res.status(201).send({
      success: true,
      message: "Successfully register.",
    });
  } catch (error) {
    next(error);
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const authResult = await userService.authenticate(email, password);

    if (!authResult.success) {
      throw new UnAuthorizeException("Email or Password are incorect!");
    }

    const user = authResult.user;

    const token = tokenService.sign({
      ID: user.user_id,
    });

    const userData = userTransformer.getUserData(user);

    res.send({
      success: true,
      token,
      user: userData,
      message: "Successfully logged in",
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userService.getUserBy("email", email);

    if (user.success) {
      const expireTime = Math.floor(Date.now() / 1000) + 60 * 60;

      const resetKey = tokenService.sign({
        ID: user.data.user_id,
        email: user.data.email,
        exp: expireTime,
      });

      const updateResult = await userService.update(
        { reset_password_key: resetKey },
        { user_id: user.data.user_id }
      );

      if (updateResult.error) {
        throw new ServerException("Something went wrong. try again...");
      }

      if (!updateResult.success) {
        return res.send({
          success: false,
          message: "Something went wrong. try again...",
        });
      }

      const token = resetKey.replace(/\./g, "-dot-");

      const mailData = {
        from: "auth@server.com",
        to: user.data.email,
        subject: "password reset",
        html: `<a href="${FRONT_URL}/password-reset/${token}">reset-password-link</a><p>If you don’t use this link within 1 hour, it will expire.</p>`,
      };
      await notificationService.sendMail(mailData);
    }

    res.send({
      success: true,
      message:
        "Please check your email and click on the provided link to reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

exports.checkResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new UnAuthorizeException("Unauthorize Access!");
    }

    const formattedToken = token.replace(/\-dot\-/g, ".");

    const user = await userService.getUserBy(
      "reset_password_key",
      formattedToken
    );

    if (!user.success) {
      throw new UnAuthorizeException("Unauthorize Access!");
    }

    const validateTokenResult = tokenService.verify(formattedToken);

    if (!validateTokenResult.success) {
      throw new UnAuthorizeException("Token expired!");
    }

    return res.send({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { userID, newPassword } = req.body;

    const hashedPassword = hashService.hashPassword(newPassword);

    const updateResult = await userService.update(
      {
        password: hashedPassword,
        reset_password_key: null,
      },
      { user_id: userID }
    );

    if (!updateResult.success) {
      throw new ServerException("Something went wrong. try again");
    }

    res.send({
      success: true,
      message: "Successfully change password.",
    });
  } catch (error) {
    next(error);
  }
};
