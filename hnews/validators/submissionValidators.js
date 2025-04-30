const { body, param } = require("express-validator");

/**
 * Validation middleware for creating a new submission.
 * Ensures that title is provided and within the correct length.
 * URL and text are optional, but if provided, must meet format and length constraints.
 */
exports.createSubmissionValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 300 })
    .withMessage("Title must be between 1 and 300 characters"),

  body("url")
    .optional({ checkFalsy: true }) // URL is optional for text submissions (e.g., "ask" posts)
    .isURL()
    .withMessage("URL must be valid"),

  body("text")
    .optional({ checkFalsy: true })
    .isLength({ max: 5000 })
    .withMessage("Text must be less than 5000 characters"),
];

/**
 * Validation middleware for checking submissionId in request params.
 * Ensures submissionId is provided and is a valid MongoDB ObjectId.
 */
exports.submissionIdValidation = [
  param("submissionId")
    .notEmpty()
    .withMessage("Submission ID is required")
    .isMongoId()
    .withMessage("Invalid submission ID"),
];
