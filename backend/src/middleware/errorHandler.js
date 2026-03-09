/**
 * Express error-handling middleware. Maps statusCode-bearing errors to HTTP responses; logs 500s.
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "An unexpected error occurred." : err.message;

  if (statusCode === 500) {
    console.error(`[${err.name}] ${err.message}`);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
