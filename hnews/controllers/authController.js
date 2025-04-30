

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateTokens,
  refreshTokens,
  revokeRefreshToken,
} = require("../utils/token");

const RefreshTokenModel = require("../models/RefreshToken");

const {
  isAnExistingUser,
  createNewUser,
  isAnExistingUserByUsername,
  isPassMatching,
  findUserById,
} = require("../utils/UserService");

const { userToView } = require("../viewModels/userViewModel");
const jwtConfig = require("../config/jwt");

/**
 * Handles user registration.
 * 
 * Route: POST /api/auth/register
 * 
 * @param {Object} req - Express request object containing username, password, and optional role.
 * @param {Object} res - Express response object.
 */
exports.register = async (req, res) => {
  const { username, password, role = "guest" } = req.body;

  // Check if the username is already taken.
  if (await isAnExistingUserByUsername(username)) {
    return res.status(400).json({ error: "Username is already taken." });
  }

  // Create a new user with the provided credentials.
  const user = await createNewUser(username, password, role);

  // Return the user data excluding sensitive information like password.
  return res
    .status(201)
    .json({ message: "User registered successfully", user: userToView(user) });
};

/**
 * Handles user login.
 * 
 * Route: POST /api/auth/login
 * 
 * @param {Object} req - Express request object containing username and password.
 * @param {Object} res - Express response object.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username.
  const user = await isAnExistingUserByUsername(username);
  if (!user) {
    return res
      .status(404)
      .json({ error: "User not found, please register first." });
  }

  // Verify the provided password matches the stored hash.
  if (!(await isPassMatching(password, user))) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // Check if the user is blocked.
  if (user.isBlocked) {
    if (user.blockedUntil && user.blockedUntil > Date.now()) {
      return res.status(403).json({ error: "User is temporarily blocked." });
    }
    if (!user.blockedUntil) {
      return res.status(403).json({ error: "User is permanently blocked." });
    }
  }

  // Generate access and refresh tokens.
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Store the refresh token in an HttpOnly cookie.
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Respond with the access token and user profile.
  return res.json({
    accessToken,
    user: userToView(user),
  });
};

/**
 * Refreshes the access token using the refresh token.
 * 
 * Route: POST /api/auth/refresh
 * 
 * @param {Object} req - Express request object containing cookies.
 * @param {Object} res - Express response object.
 */
exports.refreshAccessToken = async (req, res) => {
  // Retrieve the refresh token from cookies.
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) {
    return res.status(400).json({ error: "Refresh token is required." });
  }

  try {
    // Generate new access and refresh tokens.
    const { accessToken, refreshToken } = await refreshTokens(oldToken);

    // Update the refresh token in the cookie.
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with the new access token.
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

/**
 * Logs out the user by revoking the refresh token.
 * 
 * Route: POST /api/auth/logout
 * 
 * @param {Object} req - Express request object containing cookies.
 * @param {Object} res - Express response object.
 */
exports.logout = async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (oldToken) {
    // Revoke the refresh token and clear the cookie.
    await revokeRefreshToken(oldToken);
    res.clearCookie("refreshToken");
  }
  return res.json({ message: "Logged out successfully." });
};
