const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Apply auth and admin check middleware to all admin routes
router.use(verifyToken, roleMiddleware('admin'));

// Block/unblock users
router.post('/block/:userId', adminController.blockUser);
router.post('/unblock/:userId', adminController.unblockUser);

// Delete submission or comment
router.delete('/submission/:submissionId', adminController.deleteSubmission);
router.delete('/comment/:commentId', adminController.deleteComment);

// User operations
router.get('/users', adminController.getAllUsers);
router.get('/find-user', adminController.findUserByUsername); 

module.exports = router;
