const nodemailer = require("nodemailer");

const {EMAIL_HOST,EMAIL_PORT,EMAIL_USER,EMAIL_PASSWORD} = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

exports.sendMail = async (data) => {
  const result = await transporter.sendMail(data);
  console.log(result);
};
