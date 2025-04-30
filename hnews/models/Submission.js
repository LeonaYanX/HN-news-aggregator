const mongoose = require("mongoose");

/**
 * Submission Schema for MongoDB.
 *
 * This schema defines the structure of a submission document.
 * A submission is created by a user, may contain a URL, text, and a title,
 * and tracks votes, comments, and its specific type (story, ask, show, or job).
 * The schema also enables automatic timestamping.
 */
const submissionSchema = new mongoose.Schema(
  {
    /**
     * The ID of the user who created the submission.
     * This field references the "User" collection and is required.
     *
     * @type {mongoose.Schema.Types.ObjectId}
     */
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    /**
     * The creation date of the submission.
     * Defaults to the current date and time.
     *
     * @type {Date}
     */
    createdAt: { type: Date, default: Date.now },

    /**
     * The URL associated with the submission, if any.
     *
     * @type {String}
     */
    url: String,

    /**
     * The text content of the submission, if any.
     *
     * @type {String}
     */
    text: String,

    /**
     * The title of the submission.
     * This field is required.
     *
     * @type {String}
     */
    title: { type: String, required: true },

    /**
     * An array of user IDs who voted for this submission.
     * Each element references the "User" collection.
     *
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     */
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    /**
     * The specific type of the submission.
     * Can only be one of "story", "ask", "show", or "job".
     * Defaults to "story".
     *
     * @type {String}
     */
    specific: {
      type: String,
      enum: ["story", "ask", "show", "job"],
      default: "story",
    },

    /**
     * An array of comment IDs associated with this submission.
     * Each element references the "Comment" collection.
     *
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     */
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    // Enable automatic creation of 'createdAt' and 'updatedAt' timestamp fields.
    timestamps: true,
  }
);

// Export the Submission model based on the submissionSchema.
module.exports = mongoose.model("Submission", submissionSchema);
