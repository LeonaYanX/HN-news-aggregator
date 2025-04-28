const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authenticate');
const { createSubmissionValidation, submissionIdValidation } = require('../validators/submissionValidators');
const validateRequest = require('../middleware/validateRequest');

// POST /api/submission/ - creating new submission
router.post('/', verifyToken, authenticate, createSubmissionValidation, validateRequest, submissionController.createStory);

// GET /api/submission/ - getting all submissions
router.get('/', submissionController.getStories);

// POST /api/submission/:submissionId/vote - voting for submission
router.post('/:submissionId/vote', verifyToken, authenticate, submissionIdValidation, validateRequest, submissionController.voteStory);

// POST /api/submission/:submissionId/unvote - unvote submission
router.post('/:submissionId/unvote', verifyToken, authenticate, submissionIdValidation, validateRequest, submissionController.unvoteSubmission);

// GET /api/submission/past - past submissions
router.get('/past', submissionController.getPastSubmissions);

// GET /api/submission/new - new submissions
router.get('/new', submissionController.getStories);

// GET /api/submission/ask - submissions type ask
router.get('/ask', submissionController.getAskSubmissions);

// GET /api/submission/show - submissions type show
router.get('/show', submissionController.getShowSubmissions);

// GET /api/submission/job - submissions type job
router.get('/job', submissionController.getJobSubmissions);

// GET /api/submission/:submissionId/owner - submission owner
router.get('/:submissionId/owner', submissionIdValidation, validateRequest, submissionController.getSubmissionOwner);

// GET /api/submission/day/back - back day submissions
router.get('/day/back', submissionController.getSubmissionsByDay);

// GET /api/submission/month/back - back month submissions
router.get('/month/back', submissionController.getSubmissionsByMonth);

// GET /api/submission/year/back - back year submissions
router.get('/year/back', submissionController.getSubmissionsByYear);

module.exports = router;
