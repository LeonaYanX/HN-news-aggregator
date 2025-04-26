const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//POST /api/auth/register new user registration

router.post('/register', authController.register);

//POST /api/auth/login user login

router.post('/login', authController.login);

//POST /api/auth/refresh access token refreshing route

router.post('/refresh', authController.refreshAccessToken);

//POST /api/auth/logout logout and refresh token deleting in one

router.post('/logout' , authController.logout);

module.exports = router;