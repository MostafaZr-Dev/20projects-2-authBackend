
module.exports = (error, req, res, next) => {
  res.status(error.status).send({
    status: error.status,
    code: error.name,
    message: error.message,
  });
};
