const User = require("../models/User");
const Submission = require("../models/Submission");
const Comment = require("../models/Comment");

/**
 * Finds all users whose usernames match the given regular expression.
 * @param {RegExp} regExp - Regular expression to match usernames.
 * @returns {Promise<Array<Object>>} - List of matched users.
 * @throws {Object} - Error object with status and message if regExp is not provided.
 */
async function findAllUsersByRegExp(regExp) {
  if (!regExp) {
    throw { status: 400, message: "Regular Expression required." };
  }

  const users = await User.find({ username: regExp }).lean();
  return users;
}

/**
 * Finds all submissions where title, text, or URL matches the given regular expression.
 * @param {RegExp} regExp - Regular expression to match against submission fields.
 * @returns {Promise<Array<Object>>} - List of matched submissions with author usernames.
 * @throws {Object} - Error object with status and message if regExp is not provided.
 */
async function findAllSubmissionsByRegExp(regExp) {
  if (!regExp) {
    throw { status: 400, message: "Regular Expression required." };
  }

  const submissions = await Submission.find({
    $or: [{ title: regExp }, { text: regExp }, { url: regExp }],
  })
    .populate("by", "username") // Populate 'by' field with username only
    .lean();

  return submissions;
}

/**
 * Finds all comments whose text matches the given regular expression.
 * @param {RegExp} regExp - Regular expression to match comment text.
 * @returns {Promise<Array<Object>>} - List of matched comments with user and submission info.
 * @throws {Object} - Error object with status and message if regExp is not provided.
 */
async function findAllCommentsByRegExp(regExp) {
  if (!regExp) {
    throw { status: 400, message: "Regular Expression required." };
  }

  const comments = await Comment.find({ text: regExp })
    .populate("userId", "username") // Populate userId with username
    .populate("onSubmission", "url title") // Populate submission with url and title
    .lean();

  return comments;
}

module.exports = {
  findAllUsersByRegExp,
  findAllSubmissionsByRegExp,
  findAllCommentsByRegExp,
};
