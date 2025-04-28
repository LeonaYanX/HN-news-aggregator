const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authenticate');
const {
  updateProfileValidation,
  changePasswordValidation,
  submissionIdValidation,
  commentIdValidation,
  userIdValidation
} = require('../validators/userValidators');
const validateRequest = require('../middleware/validateRequest');

// All routs need 
router.use(verifyToken);
router.use(authenticate);

// GET /api/user/me - getting profile
router.get('/me', userController.getProfile);

// PUT /api/user/me - updating profile
router.put('/me', updateProfileValidation, validateRequest, userController.updateProfile);

// POST /api/user/me/favorites/submission/:submissionId - add submission to favorite
router.post('/favorites/submission/:submissionId', submissionIdValidation, validateRequest, userController.favoriteSubmission);

// POST /api/user/me/favorites/comment/:commentId - add comment to favorite
router.post('/favorites/comment/:commentId', commentIdValidation, validateRequest, userController.favoriteComment);

// PUT /api/user/change-password - change password
router.put('/change-password', changePasswordValidation, validateRequest, userController.changePassword);

// DELETE /api/user/favorites/submissions/:submissionId - Delete submission from favorites
router.delete('/favorites/submissions/:submissionId', submissionIdValidation, validateRequest, userController.unfavoriteSubmission);

// DELETE /api/user/favorites/comments/:commentId - Delete comment from favorites
router.delete('/favorites/comments/:commentId', commentIdValidation, validateRequest, userController.unfavoriteComment);

// DELETE /api/user/submissions/:submissionId - Delete own submission
router.delete('/submissions/:submissionId', submissionIdValidation, validateRequest, userController.deleteOwnSubmission);

// PUT /api/user/:userId/vote - Vote user
router.put('/:userId/vote', userIdValidation, validateRequest, userController.voteUser);

module.exports = router;
