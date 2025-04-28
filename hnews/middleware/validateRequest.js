const { validationResult } = require('express-validator');

// middleware for validation error handling
module.exports = function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); //return all validation errors
  }

  next(); // If there is no errors give controll to next
};
