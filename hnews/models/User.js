const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * User Schema for MongoDB.
 *
 * Defines the structure of a user document, including fields for username, password,
 * role, karma, and relationships to submissions and comments. Additionally, it includes
 * fields for account status like isBlocked and blockedUntil, as well as an "about" section.
 */
const userSchema = new mongoose.Schema({
  /**
   * The unique username of the user.
   *
   * @type {String}
   * @required
   */
  username: {
    type: String,
    unique: true,
    required: true,
  },
  /**
   * The hashed password of the user.
   *
   * @type {String}
   * @required
   */
  password: {
    type: String,
    required: true,
  },
  /**
   * The creation date of the user account.
   *
   * @type {Date}
   * @default Date.now
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },
  /**
   * The role of the user.
   * Can be either "guest" or "admin".
   *
   * @type {String}
   * @enum ["guest", "admin"]
   * @default "guest"
   */
  role: {
    type: String,
    enum: ["guest", "admin"],
    default: "guest",
  },
  /**
   * The karma score of the user.
   *
   * @type {Number}
   * @default 1
   */
  karmaCount: {
    type: Number,
    default: 1,
  },
  karma:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  /**
   * Indicates whether the user is blocked.
   *
   * @type {Boolean}
   * @default false
   */
   isBlocked: {
    type: Boolean,
    default: false,
  },
  /**
   * The date until which the user is blocked.
   *
   * @type {Date}
   * @default null
   */
  blockedUntil: {
    type: Date,
    default: null,
  },
  /**
   * A brief description or "about" text for the user.
   *
   * @type {String}
   * @maxlength 1000
   */
  about: {
    type: String,
    maxlength: 1000,
  },
  /**
   * Array of submission IDs created by the user.
   *
   * @type {Array<mongoose.Schema.Types.ObjectId>}
   * @ref "Submission"
   */
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  /**
   * Array of comment IDs created by the user.
   *
   * @type {Array<mongoose.Schema.Types.ObjectId>}
   * @ref "Comment"
   */
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  /**
   * Array of submission IDs favorited by the user.
   *
   * @type {Array<mongoose.Schema.Types.ObjectId>}
   * @ref "Submission"
   */
  favoriteSubmissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  /**
   * Array of comment IDs favorited by the user.
   *
   * @type {Array<mongoose.Schema.Types.ObjectId>}
   * @ref "Comment"
   */
  favoriteComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

/**
 * Pre-save hook to hash the user's password.
 *
 * This middleware runs before saving a user document. If the password field has been modified,
 * it generates a salt and hashes the password using bcrypt.
 *
 * @param {Function} next - The next middleware function.
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  try {
    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Compares a candidate password with the user's hashed password.
 *
 * This method is used during login to check if the provided password matches the stored hash.
 *
 * @param {String} candidatePassword - The plain text password to compare.
 * @return {Promise<boolean>} Resolves to true if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Pre-save hook to normalize the username.
 *
 * If the username is modified, this hook converts it to lowercase and trims any extra whitespace.
 *
 * @param {Function} next - The next middleware function.
 */
userSchema.pre("save", function (next) {
  if (this.isModified("username")) {
    this.usernameLC = this.username.toLowerCase().trim();
  }
  next();
});

// Export the User model based on the userSchema.
module.exports = mongoose.model("User", userSchema);
