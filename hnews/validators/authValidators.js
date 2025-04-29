const { body } = require('express-validator');

// validation for registration
exports.registerValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long')
];
// validation for login

exports.loginValidation = [
    body('username')
      .notEmpty().withMessage('Username is required'),
  
    body('password')
      .notEmpty().withMessage('Password is required')
  ];