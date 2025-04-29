const { body, param } = require('express-validator');

// validation for new submission
exports.createSubmissionValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 300 }).withMessage('Title must be between 1 and 300 characters'),

  body('url')
    .optional({ checkFalsy: true }) // URL can be empty for 'ask' type
    .isURL().withMessage('URL must be valid'),

  body('text')
    .optional({ checkFalsy: true })
    .isLength({ max: 5000 }).withMessage('Text must be less than 5000 characters'),

];

// validation for submissionId in params
exports.submissionIdValidation = [
  param('submissionId')
    .notEmpty().withMessage('Submission ID is required')
    .isMongoId().withMessage('Invalid submission ID')
];
