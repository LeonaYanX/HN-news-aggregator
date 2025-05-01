const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  updateProfileValidation,
  changePasswordValidation,
  userIdValidation,
} = require("../validators/userValidators");
const {submissionIdValidation}= require('../validators/submissionValidators');
const {commentIdValidation}= require('../validators/commentValidators');
const validateRequest = require("../middleware/validateRequest");

// Protect all routes below: user must be authenticated to access any of them
router.use(requireAuth);

/**
 * GET /api/user/me
 * Retrieve the current authenticated user's profile.
 *
 * Middleware:
 *   - requireAuth: ensure user is logged in and `req.user` is set
 *
 * Controller:
 *   - userController.getProfile
 */
router.get("/me", userController.getProfile);

/**
 * PUT /api/user/me
 * Update the current user's "about" field.
 *
 * Body validation:
 *   - updateProfileValidation: checks that "about" is present and valid
 *   - validateRequest: send 400 if validation fails
 *
 * Controller:
 *   - userController.updateProfile
 */
router.put(
  "/me",
  updateProfileValidation,
  validateRequest,
  userController.updateProfile
);

/**
 * POST /api/user/me/favorites/submission/:submissionId
 * Add a submission to the current user's favorites.
 *
 * URL Parameters:
 *   - submissionId: Mongo ObjectId of the submission to favorite
 *
 * Middleware:
 *   - submissionIdValidation: ensures valid ObjectId
 *   - validateRequest: sends 400 if invalid
 *
 * Controller:
 *   - userController.favoriteSubmission
 */
router.post(
  "/favorites/submission/:submissionId",
  submissionIdValidation,
  validateRequest,
  userController.favoriteSubmission
);

/**
 * POST /api/user/me/favorites/comment/:commentId
 * Add a comment to the current user's favorites.
 *
 * URL Parameters:
 *   - commentId: Mongo ObjectId of the comment to favorite
 *
 * Middleware:
 *   - commentIdValidation
 *   - validateRequest
 *
 * Controller:
 *   - userController.favoriteComment
 */
router.post(
  "/favorites/comment/:commentId",
  commentIdValidation,
  validateRequest,
  userController.favoriteComment
);

/**
 * PUT /api/user/change-password
 * Change the current user's password.
 *
 * Body validation:
 *   - changePasswordValidation: checks oldPassword & newPassword fields
 *   - validateRequest
 *
 * Controller:
 *   - userController.changePassword
 */
router.put(
  "/change-password",
  changePasswordValidation,
  validateRequest,
  userController.changePassword
);

/**
 * DELETE /api/user/favorites/submissions/:submissionId
 * Remove a submission from the current user's favorites.
 *
 * URL Parameters:
 *   - submissionId: Mongo ObjectId of the submission to unfavorite
 *
 * Middleware:
 *   - submissionIdValidation
 *   - validateRequest
 *
 * Controller:
 *   - userController.unfavoriteSubmission
 */
router.delete(
  "/favorites/submissions/:submissionId",
  submissionIdValidation,
  validateRequest,
  userController.unfavoriteSubmission
);

/**
 * DELETE /api/user/favorites/comments/:commentId
 * Remove a comment from the current user's favorites.
 *
 * URL Parameters:
 *   - commentId: Mongo ObjectId of the comment to unfavorite
 *
 * Middleware:
 *   - commentIdValidation
 *   - validateRequest
 *
 * Controller:
 *   - userController.unfavoriteComment
 */
router.delete(
  "/favorites/comments/:commentId",
  commentIdValidation,
  validateRequest,
  userController.unfavoriteComment
);

/**
 * DELETE /api/user/submissions/:submissionId
 * Delete one of the current user's own submissions.
 *
 * URL Parameters:
 *   - submissionId: Mongo ObjectId of the submission to delete
 *
 * Middleware:
 *   - submissionIdValidation
 *   - validateRequest
 *
 * Controller:
 *   - userController.deleteOwnSubmission
 */
router.delete(
  "/submissions/:submissionId",
  submissionIdValidation,
  validateRequest,
  userController.deleteOwnSubmission
);

/**
 * PUT /api/user/:userId/vote
 * Up-vote another user (increments their karma by +1).
 *
 * URL Parameters:
 *   - userId: Mongo ObjectId of the target user
 *
 * Middleware:
 *   - userIdValidation: ensure valid ObjectId
 *   - validateRequest
 *
 * Controller:
 *   - userController.voteUser
 */
router.put(
  "/:userId/vote",
  userIdValidation,
  validateRequest,
  userController.voteUser
);

 /**
 * PUT /api/user/:userId/unvote
 * Down-vote another user (decrements their karma by -1).
 *
 * URL Parameters:
 *   - userId: Mongo ObjectId of the target user
 *
 * Middleware:
 *   - userIdValidation: ensure valid ObjectId
 *   - validateRequest
 *
 * Controller:
 *   - userController.unvoteUser
 */
router.post('/:userId/vote',userIdValidation, validateRequest, userController.voteUser);

// Unvote a user (decrement karma by -1)

router.put('/:userId/unvote',userIdValidation, validateRequest, userController.unvoteUser);

// Route to get vote status for the authenticated user
router.get('/vote-status',userIdValidation, validateRequest, authMiddleware, getVoteStatus);

module.exports = router;
