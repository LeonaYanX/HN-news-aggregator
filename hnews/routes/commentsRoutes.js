const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authenticate');
const { createCommentValidation, commentIdValidation }
 = require('../validators/commentValidators');
const validateRequest = require('../middleware/validateRequest');

//POST /api/comment/submissions/:submissionId/comments   create comment
router.post('/submissions/:submissionId/comments',authenticate
    ,createCommentValidation,validateRequest, commentController.createComment);
//GET /api/comment/:submissionId  getting all comments for submission
router.get('/:submissionId', commentController.getCommentsForSubmission);
//POST api/comment/:commentId/vote voting for comment
router.post('/:commentId/vote',verifyToken, authenticate
    ,commentIdValidation,validateRequest, commentController.voteComment);
// api/comment/:commentId/unvote Unvote comment
router.post('/:commentId/unvote', verifyToken, authenticate,
    commentIdValidation,validateRequest, commentController.unvoteComment);
//GET api/comment/:commentId/parent getting parent comment of our comment
router.get('/:commentId/parent',commentIdValidation,validateRequest,
     commentController.getParentComment);
//GET api/comment/:commentId/context getting context for the comment
router.get('/:commentId/context',commentIdValidation,validateRequest,
     commentController.getCommentContext);
//GET api/comment/:commentId/submission getting on  submission for comment
router.get('/:commentId/submission',commentIdValidation,validateRequest,
     commentController.getSubmissionForComment);
//GET api/comment/:commentId/owner getting owner of the comment
router.get('/:commentId/owner',commentIdValidation,validateRequest,
     commentController.getCommentOwner);
//GET api/comment/:commentId/previous getting prev for comment
router.get('/:commentId/previous',commentIdValidation,validateRequest,
     commentController.getPreviousComment);
//GET api/comment/:commentId/next getting next for comment
router.get('/:commentId/next', commentIdValidation,validateRequest,
    commentController.getNextComment);
//POST api/comment/:parentId/reply reply to the comment 
router.post('/:parentId/reply', verifyToken, authenticate,commentIdValidation,
    validateRequest, commentController.replyToComment);
// GET api/comment/:commentId/children getting all chindren(replies) for the comment
router.get('/:commentId/children',commentIdValidation,validateRequest,
     commentController.getCommentChildren);


module.exports = router;
