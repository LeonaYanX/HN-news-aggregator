const { validationResult } = require("express-validator");

/**
 * Middleware for handling validation errors.
 *
 * This middleware checks for any validation errors on the request using express-validator's
 * validationResult function. If errors are found, it returns a 400 status code with an array
 * of error messages. Otherwise, it passes control to the next middleware or route handler.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @return {void}
 */
module.exports = function validateRequest(req, res, next) {
  const errors = validationResult(req);

  // Return a 400 response with validation errors if there are any.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // No errors detected; pass control to the next middleware.
  next();
};
