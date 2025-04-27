const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authenticate');

//POST /api/comment/submissions/:submissionId/comments   create comment
router.post('/submissions/:submissionId/comments',authenticate, commentController.createComment);
//GET /api/comment/:submissionId  getting all comments for submission
router.get('/:submissionId', commentController.getCommentsForSubmission);
//POST api/comment/:commentId/vote voting for comment
router.post('/:commentId/vote',verifyToken, authenticate, commentController.voteComment);
// api/comment/:commentId/unvote Unvote comment
router.post('/:commentId/unvote', verifyToken, authenticate, commentController.unvoteComment);
//GET api/comment/:commentId/parent getting parent comment of our comment
router.get('/:commentId/parent', commentController.getParentComment);
//GET api/comment/:commentId/context getting context for the comment
router.get('/:commentId/context', commentController.getCommentContext);
//GET api/comment/:commentId/submission getting on  submission for comment
router.get('/:commentId/submission', commentController.getSubmissionForComment);
//GET api/comment/:commentId/owner getting owner of the comment
router.get('/:commentId/owner', commentController.getCommentOwner);
//GET api/comment/:commentId/previous getting prev for comment
router.get('/:commentId/previous', commentController.getPreviousComment);
//GET api/comment/:commentId/next getting next for comment
router.get('/:commentId/next', commentController.getNextComment);
//POST api/comment/:parentId/reply reply to the comment 
router.post('/:parentId/reply', verifyToken, authenticate, commentController.replyToComment);
// GET api/comment/:commentId/children getting all chindren(replies) for the comment
router.get('/:commentId/children', commentController.getCommentChildren);


module.exports = router;
