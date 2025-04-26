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

module.exports = router;


