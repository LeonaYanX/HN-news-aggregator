const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const roleMiddleware = require('../middleware/roleMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');
// All route use middleware
router.use(verifyToken);
router.use(roleMiddleware('admin'));

//POST /api/admin/block user blocking
router.post('/block/:userId', adminController.blockUser);
//POST /api/admin/unblock user unblocking
router.post('/unblock/:userId', adminController.unblockUser);
//DELETE /api/admin/submission/:submissionId
router.delete('/submission/:submissionId', adminController.deleteSubmission);
//DELETE /api/admin/comment/:commentId
router.delete('/comment/:commentId', adminController.deleteComment);
//GET /api/admin/users getting users list
router.get('/users', adminController.getAllUsers);
//POST /api/admin/find-user to get user after subbmit button pushed by username
router.post('/find-user', adminController.findUserByUsername);

module.exports = router;