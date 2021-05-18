const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

const saltRounds = 10;

exports.generateID = () => uuid();

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

exports.comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
