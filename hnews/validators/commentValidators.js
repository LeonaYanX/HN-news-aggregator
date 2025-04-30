const { body, param } = require("express-validator");

/**
 * Validation middleware for creating a comment.
 * Ensures that a valid submissionId is present in the URL
 * and the comment text meets minimum length requirements.
 */
exports.createCommentValidation = [
  param("submissionId")
    .notEmpty()
    .withMessage("Submission ID (in URL) is required")
    .isMongoId()
    .withMessage("Invalid Submission ID"),

  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ min: 2 })
    .withMessage("Text must be at least 2 characters long"),
];

/**
 * Validation middleware for checking a comment ID in the URL.
 * Ensures the commentId is present and a valid MongoDB ObjectId.
 */
exports.commentIdValidation = [
  param("commentId")
    .notEmpty()
    .withMessage("Comment ID is required")
    .isMongoId()
    .withMessage("Invalid Comment ID"),
];
