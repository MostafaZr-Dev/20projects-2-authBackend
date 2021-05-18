module.exports = (req, res, next) => {
  res.status(404).send({
    status: 404,
    code: "Not Found",
    message: "request could not be handle",
  });
};
