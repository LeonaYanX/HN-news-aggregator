const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const { registerValidation, loginValidation  } = require('../validators/authValidators');
const validateRequest = require('../middleware/validateRequest');


//POST /api/auth/register new user registration

router.post('/register',registerValidation,validateRequest, authController.register);

//POST /api/auth/login user login

router.post('/login',loginValidation ,validateRequest , authController.login); 

//POST /api/auth/refresh access token refreshing route

router.post('/refresh',  authController.refreshAccessToken);

//POST /api/auth/logout logout and refresh token deleting in one

router.post('/logout' , authController.logout);

module.exports = router;