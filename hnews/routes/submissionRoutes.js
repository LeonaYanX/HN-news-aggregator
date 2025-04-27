const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const {verifyToken} = require('../middleware/authMiddleware');

//POST /api/submission/  creating new submission
router.post('/', verifyToken, submissionController.createStory);

//GET /api/submission/  getting all submissions
router.get('/', submissionController.getStories);

//POST /api/submission/:submissionId/vote voting for submission
router.post('/:submissionId/vote', verifyToken, submissionController.voteStory);

// POST /api/submission/:submissionId/unvote Unvote submission
router.post('/:submissionId/unvote', verifyToken, submissionController.unvoteSubmission);

// GET /api/submission/past past submissions
router.get('/past', submissionController.getPastSubmissions);

//GET /api/submission/new new submissions 
router.get('/new', submissionController.getNewSubmissions);

//GET /api/submission/ask submissions type - ask
router.get('/ask', submissionController.getAskSubmissions);

// GET /api/submission/show submissions type -show
router.get('/show', submissionController.getShowSubmissions);

//GET /api/submission/job submissions type - job
router.get('/job', submissionController.getJobSubmissions);

//GET /api/submission/:submissionId/owner submission owner
router.get('/:submissionId/owner', submissionController.getSubmissionOwner);

// GET /api/submission/day/back сbackday submissions
router.get('/day/back', submissionController.getSubmissionsByDay);

// GET /api/submission/month/back backmounth submissions
router.get('/month/back', submissionController.getSubmissionsByMonth);

// GET /api/submission/year/back backyear submissions
router.get('/year/back', submissionController.getSubmissionsByYear);


module.exports = router;


