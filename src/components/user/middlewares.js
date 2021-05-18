const { body, validationResult, checkSchema } = require("express-validator");
const userService = require("./services");
const tokenService = require("../../services/token");
const UnAuthorizeException = require("../exceptions/UnAuthorizeException");
const ValidationException = require("../exceptions/ValidationException");
const ConflictException = require("../exceptions/ConflictException");

exports.verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw new UnAuthorizeException("Invalid Token!");
    }

    token = token.split(" ")[1];

    const verifyTokenResult = tokenService.verify(token);

    if (!verifyTokenResult.success) {
      throw new UnAuthorizeException("Invalid Token!");
    }

    req.userID = verifyTokenResult.data.ID;
    next();
  } catch (error) {
    next(error);
  }
};

exports.validtor = (req, res, next) => {
  try {
    const errors = validationResult(req);

    let extractErrors = {};

    if (!errors.isEmpty()) {
      errors.array().map((error) => {
        const field = error.param;

        if (field in extractErrors) {
          extractErrors[field].push(error.msg);
          return;
        }

        extractErrors[field] = [error.msg];
      });

      throw new ValidationException({
        errors: extractErrors,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.validateRegisterData = checkSchema({
  firstname: {
    isEmpty: {
      errorMessage: "First Name Required!",
      negated: true,
    },
  },
  lastname: {
    isEmpty: {
      errorMessage: "Last Name Required!",
      negated: true,
    },
  },
  phone: {
    isEmpty: {
      errorMessage: "Phone Required!",
      negated: true,
    },
    matches: {
      options: /(0|\+98|0098)?9[0123][0-9]{8}/,
      errorMessage: "Your phone number wrong!",
    },
  },
  email: {
    isEmpty: {
      errorMessage: "Email Required!",
      negated: true,
    },
    isEmail: {
      errorMessage: "Invalid Email!",
      bail: true,
    },
  },
  password: {
    isEmpty: {
      errorMessage: "Password Required!",
      negated: true,
    },
    isLength: {
      errorMessage: "Password should be at least 3 chars long!",
      options: { min: 3 },
    },
  },
  confirmPassword: {
    isEmpty: {
      errorMessage: "confirmPassword Required!",
      negated: true,
    },
    custom: {
      options: (value, { req }) => {
        const password = req.body.password;

        if (password !== value) {
          throw new Error("Passwords must be same!");
        }

        return true;
      },
    },
  },
});

exports.validateAuthData = checkSchema({
  email: {
    isEmpty: {
      errorMessage: "Email Required!",
      negated: true,
    },
    isEmail: {
      errorMessage: "Invalid Email!",
      bail: true,
    },
  },
  password: {
    isEmpty: {
      errorMessage: "Password Required!",
      negated: true,
    },
    isLength: {
      errorMessage: "Password should be at least 3 chars long!",
      options: { min: 3 },
    },
  },
});

exports.validateEmail = body("email")
  .not()
  .isEmpty()
  .withMessage("Email Required!")
  .isEmail()
  .withMessage("Invalid Email!");

exports.validateResetData = checkSchema({
  newPassword: {
    isEmpty: {
      errorMessage: "New Password Required!",
      negated: true,
    },
    isLength: {
      errorMessage: "New Password should be at least 3 chars long!",
      options: { min: 3 },
    },
  },
  confirmNewPassword: {
    isEmpty: {
      errorMessage: "New ConfirmPassword Required!",
      negated: true,
    },
    custom: {
      options: (value, { req }) => {
        const newPassword = req.body.newPassword;

        if (newPassword !== value) {
          throw new Error("Passwords must be same!");
        }

        return true;
      },
    },
  },
});

exports.checkUserExist = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    let user = await userService.getUserBy("email", email);

    if (user.success) {
      throw new ConflictException("Email is already registered!");
    }

    user = await userService.getUserBy("phone", phone);

    if (user.success) {
      throw new ConflictException("Phone is already registered!");
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.checkValidToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new UnAuthorizeException("Invalid Token!");
    }

    const formattedToken = token.replace(/\-dot\-/g, ".");

    const user = await userService.getUserBy(
      "reset_password_key",
      formattedToken
    );

    if (!user.success) {
      throw new UnAuthorizeException("Invalid Token!");
    }

    const validateTokenResult = tokenService.verify(formattedToken);

    if (!validateTokenResult.success) {
      throw new UnAuthorizeException("Token Expired!");
    }

    req.body.userID = validateTokenResult.data.ID;

    next();
  } catch (error) {
    next(error);
  }
};
