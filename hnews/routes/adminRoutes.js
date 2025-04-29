const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { userIdValidation, findUserByUsernameValidation  } = require('../validators/userValidators');
const { submissionIdValidation } = require('../validators/submissionValidators');
const { commentIdValidation } = require('../validators/commentValidators');
const validateRequest = require('../middleware/validateRequest');

// Apply auth and admin check middleware to all admin routes
router.use(requireAuth, roleMiddleware('admin'));

// Block/unblock users
router.post('/block/:userId', userIdValidation, validateRequest, adminController.blockUser);
router.post('/unblock/:userId', userIdValidation, validateRequest, adminController.unblockUser);

// Delete submission or comment
router.delete('/submission/:submissionId', submissionIdValidation, validateRequest, adminController.deleteSubmission);
router.delete('/comment/:commentId', commentIdValidation, validateRequest, adminController.deleteComment);

// User operations 
router.get('/users', adminController.getAllUsers);
router.get('/find-user',findUserByUsernameValidation ,validateRequest,
     adminController.findUserByUsername);

module.exports = router;

