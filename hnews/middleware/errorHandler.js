/**
 * Global error handler middleware.
 *
 * Logs the error to the console and returns an HTTP response with the error message.
 * If the error has a statusCode, it is used; otherwise, a 500 status code is returned.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @return {void} Sends the error response.
 */
function errorHandler(err, req, res, next) {
  console.error("Global Error Handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
