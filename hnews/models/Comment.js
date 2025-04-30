const mongoose = require("mongoose");

/**
 * Comment Schema for MongoDB.
 *
 * Defines the structure of a comment document in the database.
 * Each comment is associated with a user (author), may have a parent comment (for nested comments),
 * belongs to a submission, contains an array of votes from users, and includes the comment text.
 */
const commentSchema = new mongoose.Schema({
  /**
   * The ID of the user who created the comment.
   * This field references the User collection and is required.
   *
   * @type {mongoose.Schema.Types.ObjectId}
   */
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  /**
   * The timestamp when the comment was created.
   * Defaults to the current date and time.
   *
   * @type {Date}
   */
  createdAt: { type: Date, default: Date.now },

  /**
   * The ID of the parent comment.
   * This field is used for creating nested comments (threads).
   * It references the Comment collection.
   *
   * @type {mongoose.Schema.Types.ObjectId}
   */
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },

  /**
   * The ID of the submission to which the comment belongs.
   * This field references the Submission collection.
   *
   * @type {mongoose.Schema.Types.ObjectId}
   */
  onSubmission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },

  /**
   * An array of user IDs who voted for this comment.
   * Each element references the User collection.
   *
   * @type {Array<mongoose.Schema.Types.ObjectId>}
   */
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  /**
   * The text content of the comment.
   * This field is required.
   *
   * @type {String}
   */
  text: { type: String, required: true },
});

// Export the Comment model based on the commentSchema.
module.exports = mongoose.model("Comment", commentSchema);
