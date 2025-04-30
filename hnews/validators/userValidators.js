const { body, param, query } = require("express-validator");

/**
 * Validation for finding a user by username (query parameter).
 * Ensures the username exists and is at least 3 characters long.
 */
exports.findUserByUsernameValidation = [
  query("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
];

/**
 * Admin-only validation for updating a user's 'about' field.
 * Requires the field and enforces a length between 5 and 300 characters.
 */
exports.updateUserAboutValidation = [
  body("about")
    .notEmpty()
    .withMessage("About field is required")
    .isLength({ min: 5, max: 300 })
    .withMessage("About must be between 5 and 300 characters"),
];

/**
 * Validation for regular users updating their own profile.
 * 'About' field is optional but must be no longer than 500 characters if provided.
 */
exports.updateProfileValidation = [
  body("about")
    .optional()
    .isLength({ max: 500 })
    .withMessage("About must be less than 500 characters"),
];

/**
 * Validation for changing password.
 * Ensures both current and new passwords are provided and the new one is at least 6 characters.
 */
exports.changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

/**
 * Validation for userId in URL parameters.
 * Ensures it exists and is a valid MongoDB ObjectId.
 */
exports.userIdValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),
];
