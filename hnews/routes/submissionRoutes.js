const express = require("express");
const router = express.Router();

const submissionController = require("../controllers/submissionController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  createSubmissionValidation,
  submissionIdValidation,
} = require("../validators/submissionValidators");
const validateRequest = require("../middleware/validateRequest");

/**
 * POST /api/submission/
 * Create a new submission.
 *
 * Middleware:
 *   - requireAuth:            Verify JWT and authenticate user.
 *   - createSubmissionValidation:  Validate request body fields (title, url/text, specific).
 *   - validateRequest:        Send 400 if validation fails.
 *
 * Controller:
 *   - submissionController.createStory
 */
router.post(
  "/",
  requireAuth,
  createSubmissionValidation,
  validateRequest,
  submissionController.createStory
);

/**
 * GET /api/submission/
 * Retrieve all "story" submissions sorted by newest first.
 *
 * Controller:
 *   - submissionController.getStories
 */

/**
 * @openapi
 * /api/submission:
 *   get:
 *     summary: List all story-type submissions
 *     tags:
 *       - Submission
 *     responses:
 *       '200':
 *         description: A JSON array of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   votesCount:
 *                     type: integer
 *                   by:
 *                     type: string
 *                   createdAt:
 *                     type: string
 */
router.get("/", submissionController.getStories);

/**
 * POST /api/submission/:submissionId/vote
 * Up-vote a submission.
 *
 * URL Parameters:
 *   - submissionId {string}  ID of the submission to vote on.
 *
 * Middleware:
 *   - requireAuth:            Verify JWT and authenticate user.
 *   - submissionIdValidation: Validate that submissionId is a valid Mongo ObjectId.
 *   - validateRequest:        Send 400 if validation fails.
 *
 * Controller:
 *   - submissionController.voteStory
 */
router.post(
  "/:submissionId/vote",
  requireAuth,
  submissionIdValidation,
  validateRequest,
  submissionController.voteStory
);

/**
 * POST /api/submission/:submissionId/unvote
 * Remove your vote from a submission.
 *
 * URL Parameters:
 *   - submissionId {string}  ID of the submission to un-vote.
 *
 * Middleware:
 *   - requireAuth
 *   - submissionIdValidation
 *   - validateRequest
 *
 * Controller:
 *   - submissionController.unvoteSubmission
 */
router.post(
  "/:submissionId/unvote",
  requireAuth,
  submissionIdValidation,
  validateRequest,
  submissionController.unvoteSubmission
);

/**
 * GET /api/submission/past
 * Retrieve all "story" submissions sorted oldest first.
 *
 * Controller:
 *   - submissionController.getPastSubmissions
 */
router.get("/past", submissionController.getPastSubmissions);

/**
 * GET /api/submission/new
 * Retrieve latest submissions of any specific type (sorted newest first).
 *
 * Controller:
 *   - submissionController.getStories
 */
router.get("/new", submissionController.getStories);

/**
 * GET /api/submission/ask
 * Retrieve all submissions of type "ask", newest first.
 *
 * Controller:
 *   - submissionController.getAskSubmissions
 */
router.get("/ask", submissionController.getAskSubmissions);

/**
 * GET /api/submission/show
 * Retrieve all submissions of type "show", newest first.
 *
 * Controller:
 *   - submissionController.getShowSubmissions
 */
router.get("/show", submissionController.getShowSubmissions);

/**
 * GET /api/submission/job
 * Retrieve all submissions of type "job", newest first.
 *
 * Controller:
 *   - submissionController.getJobSubmissions
 */
router.get("/job", submissionController.getJobSubmissions);

/**
 * GET /api/submission/:submissionId/owner
 * Fetch the owner (user) of a specific submission.
 *
 * URL Parameters:
 *   - submissionId {string}  ID of the submission.
 *
 * Middleware:
 *   - submissionIdValidation: Ensure valid ObjectId.
 *   - validateRequest
 *
 * Controller:
 *   - submissionController.getSubmissionOwner
 */
router.get(
  "/:submissionId/owner",
  submissionIdValidation,
  validateRequest,
  submissionController.getSubmissionOwner
);

/**
 * GET /api/submission/day/back
 * Retrieve submissions created in the last day (newest first).
 *
 * Controller:
 *   - submissionController.getSubmissionsByDay
 */
router.get("/day/back", submissionController.getSubmissionsByDay);

/**
 * GET /api/submission/month/back
 * Retrieve submissions created in the last month (newest first).
 *
 * Controller:
 *   - submissionController.getSubmissionsByMonth
 */
router.get("/month/back", submissionController.getSubmissionsByMonth);

/**
 * GET /api/submission/year/back
 * Retrieve submissions created in the last year (newest first).
 *
 * Controller:
 *   - submissionController.getSubmissionsByYear
 */
router.get("/year/back", submissionController.getSubmissionsByYear);

module.exports = router;
