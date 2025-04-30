const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAuth } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  userIdValidation,
  findUserByUsernameValidation,
} = require("../validators/userValidators");
const { submissionIdValidation } = require("../validators/submissionValidators");
const { commentIdValidation } = require("../validators/commentValidators");
const validateRequest = require("../middleware/validateRequest");

/**
 * Admin Routes.
 *
 * This router handles admin-specific operations such as blocking/unblocking users,
 * deleting submissions or comments, and querying user data.
 * All routes in this router are protected by authentication and require the "admin" role.
 */

// Apply authentication and role-check middleware to all admin routes.
router.use(requireAuth, roleMiddleware("admin"));

/**
 * Block a user.
 *
 * Validates the userId parameter, then calls adminController.blockUser.
 * 
 * @route POST /block/:userId
 */
router.post(
  "/block/:userId",
  userIdValidation, // Middleware to validate userId parameter
  validateRequest,  // Middleware to handle any validation errors
  adminController.blockUser // Controller that handles blocking the user
);

/**
 * Unblock a user.
 *
 * Validates the userId parameter, then calls adminController.unblockUser.
 * 
 * @route POST /unblock/:userId
 */
router.post(
  "/unblock/:userId",
  userIdValidation,
  validateRequest,
  adminController.unblockUser
);

/**
 * Delete a submission.
 *
 * Validates the submissionId parameter, then calls adminController.deleteSubmission.
 * 
 * @route DELETE /submission/:submissionId
 */
router.delete(
  "/submission/:submissionId",
  submissionIdValidation,
  validateRequest,
  adminController.deleteSubmission
);

/**
 * Delete a comment.
 *
 * Validates the commentId parameter, then calls adminController.deleteComment.
 * 
 * @route DELETE /comment/:commentId
 */
router.delete(
  "/comment/:commentId",
  commentIdValidation,
  validateRequest,
  adminController.deleteComment
);

/**
 * Retrieve all users.
 *
 * Calls adminController.getAllUsers without any additional validations.
 * 
 * @route GET /users
 */
router.get("/users", adminController.getAllUsers);

/**
 * Find a user by username.
 *
 * Validates query parameters using findUserByUsernameValidation,
 * then calls adminController.findUserByUsername.
 * 
 * @route GET /find-user
 */
router.get(
  "/find-user",
  findUserByUsernameValidation, // Middleware for validating the username query param
  validateRequest,              // Middleware to handle any validation errors
  adminController.findUserByUsername
);

module.exports = router;
