const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const RefreshToken = require("../models/RefreshToken");

/**
 * Generates a single JWT (usually an access token) with the given payload.
 *
 * @param {Object} payload - The payload to encode in the token (e.g., { id: userId }).
 * @param {string} [expiresIn=jwtConfig.expiresIn] - Expiration time (e.g., '1h', '15m').
 * @returns {string} - The generated JWT string.
 */
function generateToken(payload, expiresIn = jwtConfig.expiresIn) {
  return jwt.sign(payload, jwtConfig.secretKey, { expiresIn });
}

/**
 * Generates a pair of tokens: access and refresh.
 * Access token is short-lived, refresh token is long-lived.
 * Saves the refresh token in the database for control and revocation.
 *
 * @param {string} userId - The MongoDB user ID.
 * @returns {Promise<{ accessToken: string, refreshToken: string }>} - The token pair.
 */
async function generateTokens(userId) {
  const payload = { id: userId };

  const accessToken = generateToken(payload, "15m");
  const refreshToken = jwt.sign({ id: userId }, jwtConfig.secretKey, {
    expiresIn: "7d",
  });

  await RefreshToken.create({
    token: refreshToken,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return { accessToken, refreshToken };
}

/**
 * Refreshes a token pair using a valid refresh token.
 * - Validates the refresh token in the database and its expiration.
 * - Generates a new token pair.
 * - Deletes the old refresh token record to prevent accumulation.
 *
 * @param {string} oldRefreshToken - The refresh token to be used for refreshing.
 * @returns {Promise<{ accessToken: string, refreshToken: string }>} - The new token pair.
 * @throws {Error} - If the token is not found or expired.
 */
async function refreshTokens(oldRefreshToken) {
  const record = await RefreshToken.findOne({ token: oldRefreshToken });

  if (!record) {
    throw new Error("Refresh token not found");
  }

  if (record.expiresAt < Date.now()) {
    await RefreshToken.deleteOne({ _id: record._id });
    throw new Error("Refresh token expired");
  }

  const { accessToken, refreshToken } = await generateTokens(record.userId);

  await RefreshToken.deleteOne({ _id: record._id });

  return { accessToken, refreshToken };
}

/**
 * Explicitly revokes a refresh token by removing it from the database.
 * Typically called during logout.
 *
 * @param {string} refreshToken - The token to revoke.
 * @returns {Promise<void>}
 */
async function revokeRefreshToken(refreshToken) {
  await RefreshToken.deleteOne({ token: refreshToken });
}

module.exports = {
  generateToken,
  generateTokens,
  refreshTokens,
  revokeRefreshToken,
};
