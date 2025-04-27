const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authenticate');

router.use(verifyToken);
router.use(authenticate);
//GET /api/user/me getting profile
router.get('/me', userController.getProfile);
//PUT /api/user/me updating profile
router.put('/me', userController.updateProfile);
//POST /api/user/me/favorites/submission/:submissionId favorite submission
router.post('/favorites/submission/:submissionId', userController.favoriteSubmission);
//POST /api/user/me/favorites/comment/:commentId favorite comment
router.post('/favorites/comment/:commentId', userController.favoriteComment);
// PUT  /api/user/change-password changing pass
router.put('/change-password', userController.changePassword);
// DELETE /api/user/favorites/submissions/:submissionId unfavorite submission////////
router.delete('/favorites/submissions/:submissionId', userController.unfavoriteSubmission);
// DELETE /api/user/favorites/comments/:commentId unfavorite comment
router.delete('/favorites/comments/:commentId', userController.unfavoriteComment);
//DELETE /api/user/submissions/:submissionId deleting own submission
router.delete('/submissions/:submissionId', userController.deleteOwnSubmission);

module.exports = router;
