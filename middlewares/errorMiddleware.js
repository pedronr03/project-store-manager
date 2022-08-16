const errorMiddleware = (err, _req, res, _next) => res.status(err.status).json({
    message: err.message,
    code: err.code,
});
  
module.exports = errorMiddleware;