const mongoose = require("mongoose");

/**
 * RefreshToken Schema for MongoDB.
 *
 * Defines the structure for a refresh token document.
 * Each refresh token is associated with a user and includes the token string
 * along with its expiration date.
 */
const refreshTokenSchema = new mongoose.Schema({
  /**
   * The refresh token string.
   *
   * @type {String}
   * @required
   */
  token: { type: String, required: true },

  /**
   * The ID of the user who owns this refresh token.
   * This field references the "User" collection.
   *
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  /**
   * The expiration date for the refresh token.
   *
   * @type {Date}
   * @required
   */
  expiresAt: { type: Date, required: true },
});

// Export the RefreshToken model using the refreshTokenSchema.
module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
