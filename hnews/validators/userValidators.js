const { body, param } = require('express-validator');

const { query } = require('express-validator');

// validation for finding user by username username
exports.findUserByUsernameValidation = [
  query('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
];

// user profile update (Admin)
exports.updateUserAboutValidation = [
  body('about')
    .notEmpty().withMessage('About field is required') 
    .isLength({ min: 5, max: 300 }).withMessage('About must be between 5 and 300 characters') // Ограничение длины
];

// validation of userId in URL
exports.userIdValidation = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid User ID')
];

// profile update validation
exports.updateProfileValidation = [
  body('about')
    .optional()
    .isLength({ max: 500 }).withMessage('About must be less than 500 characters'),
];

// passChange validator
exports.changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

// validation for ID submission or comment
exports.submissionIdValidation = [
  param('submissionId')
    .notEmpty().withMessage('Submission ID is required')
    .isMongoId().withMessage('Invalid submission ID'),
];

exports.commentIdValidation = [
  param('commentId')
    .notEmpty().withMessage('Comment ID is required')
    .isMongoId().withMessage('Invalid comment ID'),
];

// validation for userId
exports.userIdValidation = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),
];

