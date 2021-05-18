const jwt = require("jsonwebtoken");

const appSecret = process.env.APP_SECRET;

exports.sign = (data) => {
  return jwt.sign(data, appSecret);
};

exports.verify = (token) => {
  try {
    const decode = jwt.verify(token, appSecret);

    return {
      success: true,
      data: decode,
    };
    
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};
