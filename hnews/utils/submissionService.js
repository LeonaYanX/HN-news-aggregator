const Submission = require("../models/Submission");
const User = require("../models/User");

/**
 * Pushes a comment ID to the comments array of the specified submission.
 * @param {Object} submission - The submission document.
 * @param {Object} comment - The comment document.
 * @returns {Promise<boolean>} - Returns true if the operation was successful.
 * @throws {Object} - Error object if submission is not provided.
 */
async function updateSubmissionCommentsArrayPush(submission, comment) {
  if (!submission) {
    throw { status: 400, message: "Submission is required." };
  }

  await Submission.findByIdAndUpdate(submission._id, {
    $push: { comments: comment._id },
  });

  return true;
}

/**
 * Finds a submission by its ID.
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise<Object>} - The found submission.
 * @throws {Object} - Error object if ID is missing or submission not found.
 */
async function findSubmissionById(submissionId) {
  if (!submissionId) {
    throw { status: 400, message: "Submission id required" };
  }

  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw { status: 404, message: "Submission not found" };
  }

  return submission;
}

/**
 * Deletes a submission by its ID.
 * @param {string} submissionId - The ID of the submission.
 * @returns {Promise<boolean>} - Returns true if deletion was successful.
 * @throws {Object} - Error object if ID is missing or submission not found.
 */
async function deleteSubmissionById(submissionId) {
  if (!submissionId) {
    throw { status: 400, message: "Submission id required." };
  }

  const submission = await Submission.findByIdAndDelete(submissionId);
  if (!submission) {
    throw { status: 404, message: "Submission not found" };
  }

  return true;
}

/**
 * Creates a new submission and adds it to the user's submissions array.
 * @param {string} userId - ID of the user creating the submission.
 * @param {string} title - Title of the submission.
 * @param {string} url - URL of the submission.
 * @param {string} text - Text content of the submission.
 * @param {string} [specific="story"] - Type of submission (story, poll, etc).
 * @returns {Promise<Object>} - The created submission.
 * @throws {Object} - Error object if any required field is missing.
 */
async function createNewSubmission(userId, title, url, text, specific = "story") {
  if (!userId || !title || !url || !text) {
    throw { status: 400, message: "Not all params" };
  }

  const submission = new Submission({
    by: userId,
    title,
    url,
    text,
    specific: specific,
  });

  await submission.save();

  await User.findByIdAndUpdate(userId, {
    $push: { submissions: submission._id },
  });

  return submission;
}

/**
 * Finds submissions filtered by the 'specific' field and sorts them by creation date.
 * @param {Object} specificValue - The filter for the 'specific' field.
 * @param {number} sortOrder - Sort order for 'createdAt' (1 for ascending, -1 for descending).
 * @returns {Promise<Array<Object>>} - List of matched submissions.
 * @throws {Object} - Error object if specific value is not provided.
 */
async function findSubmissionBySpecific(specificValue, sortOrder) {
  if (!specificValue) {
    throw { status: 400, message: "Specific value required." };
  }

  const submissions = await Submission.find(specificValue)
    .sort({ createdAt: sortOrder })
    .populate("by", "username")
    .lean();

  return submissions;
}

/**
 * Adds a user's ID to a submission's votes array.
 * @param {string} userId - ID of the voting user.
 * @param {Object} submission - The submission document.
 * @returns {Promise<boolean>} - Returns true if the vote was added.
 * @throws {Object} - Error object if userId or submission is missing.
 */
async function addToSubmissionVotesArray(userId, submission) {
  if (!userId || !submission) {
    throw { status: 400, message: "User id and submission both required." };
  }

  submission.votes.push(userId);
  await submission.save();

  return true;
}

/**
 * Removes a user's vote from a submission.
 * @param {Object} submission - The submission document.
 * @param {string} userId - ID of the user unvoting.
 * @returns {Promise<boolean>} - Returns true if the vote was removed.
 * @throws {Object} - Error object if userId or submission is missing or user hasn't voted.
 */
async function unvoteSubmissionUtil(submission, userId) {
  if (!submission || !userId) {
    throw { status: 400, message: "Both submission and userId required." };
  }

  const voteIndex = submission.votes.indexOf(userId);
  if (voteIndex === -1) {
    throw { status: 400, message: "You have not voted for this submission" };
  }

  submission.votes.splice(voteIndex, 1);
  await submission.save();

  return true;
}

/**
 * Finds submissions created after the specified date.
 * @param {Date} date - Date to filter submissions.
 * @returns {Promise<Array<Object>>} - List of recent submissions.
 * @throws {Object} - Error object if date is not provided.
 */
async function findSubmissionfromCreatedAt(date) {
  if (!date) {
    throw { status: 400, message: "Date is required." };
  }

  const submissions = await Submission.find({ createdAt: { $gte: date } })
    .sort({ createdAt: -1 })
    .populate("by", "username")
    .lean();

  return submissions;
}

module.exports = {
  findSubmissionById,
  deleteSubmissionById,
  updateSubmissionCommentsArrayPush,
  createNewSubmission,
  findSubmissionBySpecific,
  addToSubmissionVotesArray,
  unvoteSubmissionUtil,
  findSubmissionfromCreatedAt,
};
