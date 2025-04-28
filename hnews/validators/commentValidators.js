const { body, param } = require('express-validator');

// comment creation validation
exports.createCommentValidation = [
    param('submissionId')
      .notEmpty().withMessage('Submission ID (in URL) is required')
      .isMongoId().withMessage('Invalid Submission ID'),
  
    body('text')
      .notEmpty().withMessage('Text is required')
      .isLength({ min: 2 }).withMessage('Text must be at least 2 characters long')
  ];

// validation of commentId in URL
exports.commentIdValidation = [
  param('commentId')
    .notEmpty().withMessage('Comment ID is required')
    .isMongoId().withMessage('Invalid Comment ID')
];
