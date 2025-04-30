/**
 * @fileoverview Comment routes for creating, retrieving, voting, and replying to comments.
 */

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  createCommentValidation,
  commentIdValidation,
} = require("../validators/commentValidators");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route POST /api/comment/submissions/:submissionId/comments
 * @description Create a new comment on a submission.
 * @access Private (requires JWT)
 */
router.post(
  "/submissions/:submissionId/comments",
  requireAuth,
  createCommentValidation,
  validateRequest,
  commentController.createComment
);

/**
 * @route GET /api/comment/:submissionId
 * @description Retrieve all comments for a given submission.
 * @access Public
 */
router.get(
  "/:submissionId",
  commentController.getCommentsForSubmission
);

/**
 * @route POST /api/comment/:commentId/vote
 * @description Upvote a comment.
 * @access Private (requires JWT)
 */
router.post(
  "/:commentId/vote",
  requireAuth,
  commentIdValidation,
  validateRequest,
  commentController.voteComment
);

/**
 * @route POST /api/comment/:commentId/unvote
 * @description Remove your vote from a comment.
 * @access Private (requires JWT)
 */
router.post(
  "/:commentId/unvote",
  requireAuth,
  commentIdValidation,
  validateRequest,
  commentController.unvoteComment
);

/**
 * @route GET /api/comment/:commentId/parent
 * @description Get the parent comment of a given comment, or its submission if no parent exists.
 * @access Public
 */
router.get(
  "/:commentId/parent",
  commentIdValidation,
  validateRequest,
  commentController.getParentComment
);

/**
 * @route GET /api/comment/:commentId/context
 * @description Get the full discussion context for a comment (its submission URL + all related comments).
 * @access Public
 */
router.get(
  "/:commentId/context",
  commentIdValidation,
  validateRequest,
  commentController.getCommentContext
);

/**
 * @route GET /api/comment/:commentId/submission
 * @description Retrieve the submission on which the comment was made.
 * @access Public
 */
router.get(
  "/:commentId/submission",
  commentIdValidation,
  validateRequest,
  commentController.getSubmissionForComment
);

/**
 * @route GET /api/comment/:commentId/owner
 * @description Get the user information of the comment’s author.
 * @access Public
 */
router.get(
  "/:commentId/owner",
  commentIdValidation,
  validateRequest,
  commentController.getCommentOwner
);

/**
 * @route GET /api/comment/:commentId/previous
 * @description Get the previous comment (by creation time) in the same submission.
 * @access Public
 */
router.get(
  "/:commentId/previous",
  commentIdValidation,
  validateRequest,
  commentController.getPreviousComment
);

/**
 * @route GET /api/comment/:commentId/next
 * @description Get the next comment (by creation time) in the same submission.
 * @access Public
 */
router.get(
  "/:commentId/next",
  commentIdValidation,
  validateRequest,
  commentController.getNextComment
);

/**
 * @route POST /api/comment/:parentId/reply
 * @description Reply to an existing comment.
 * @access Private (requires JWT)
 */
router.post(
  "/:parentId/reply",
  requireAuth,
  commentIdValidation,
  validateRequest,
  commentController.replyToComment
);

/**
 * @route GET /api/comment/:commentId/children
 * @description Get all direct replies (children) of a comment.
 * @access Public
 */
router.get(
  "/:commentId/children",
  commentIdValidation,
  validateRequest,
  commentController.getCommentChildren
);

/**
 * @route GET /api/comment/
 * @description Retrieve all comments in the database (for admin or analytics).
 * @access Public
 */
router.get("/", commentController.getAllComments);

module.exports = router;
