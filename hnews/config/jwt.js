/**
 * @fileoverview Configuration for JWT authentication settings.
 * Loads environment variables from a .env file using dotenv.
 */

require("dotenv").config();

/**
 * JWT configuration object.
 * @type {{ secretKey: string, expiresIn: string }}
 */
module.exports = {
  secretKey: process.env.JWT_SECRET, // Secret key for signing JWTs.
  expiresIn: "1h", // Token expiration time.
};
