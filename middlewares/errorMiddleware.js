const CustomError = require('../errors/CustomError');

const errorMiddleware = (err, _req, res, _next) => {
  console.error(err);
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
    });
  }
  return res.status(500).json({
    message: 'Internal Error',
    code: 'INTERNAL_ERROR',
  });
};

module.exports = errorMiddleware;
