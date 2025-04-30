/**
 * @fileoverview Authentication routes for user registration, login, token refresh, and logout.
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cookieParser = require("cookie-parser");

// Middleware to parse cookies from incoming requests
router.use(cookieParser());

const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");

/**
 * @route POST /api/auth/register
 * @description Register a new user.
 * @access Public
 */
router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register
);

/**
 * @route POST /api/auth/login
 * @description Authenticate user and return access token.
 * @access Public
 */
router.post(
  "/login",
  loginValidation,
  validateRequest,
  authController.login
);

/**
 * @route POST /api/auth/refresh
 * @description Refresh access token using refresh token.
 * @access Public
 */
router.post("/refresh", authController.refreshAccessToken);

/**
 * @route POST /api/auth/logout
 * @description Logout user and clear authentication cookies.
 * @access Public
 */
router.post("/logout", authController.logout);

module.exports = router;
