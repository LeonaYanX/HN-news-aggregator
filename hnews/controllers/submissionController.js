const { userToView } = require("../viewModels/userViewModel");
const { submissionToView } = require("../viewModels/submissionViewModel");
const {
  createNewSubmission,
  findSubmissionBySpecific,
  findSubmissionById,
  addToSubmissionVotesArray,
  unvoteSubmissionUtil,
  findSubmissionfromCreatedAt,
} = require("../utils/submissionService");
const { findUserById } = require("../utils/UserService");

/**
 * Creates a new submission.
 *
 * @param {Object} req - The request object containing submission data.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @return {Promise<void>} Sends the created submission in the response.
 */
exports.createStory = async (req, res) => {
  let { title, url, text, specific } = req.body;
  if (!specific) {
    specific = "story";
  }
  try {
    const submission = await createNewSubmission(
      req.user.id,
      title,
      url,
      text,
      specific
    );
    res.status(201).json(submissionToView(submission));
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Failed to create submission" });
  }
};

/**
 * Helper function to fetch and format submissions based on a filter and sort order.
 *
 * @param {Object} filter - The filter criteria for submissions.
 * @param {number} sortOrder - The sort order: -1 for descending, 1 for ascending.
 * @return {Promise<Array>} An array of formatted submissions.
 */
async function fetchAndFormatSubmissions(filter = {}, sortOrder = -1) {
  const submissions = await findSubmissionBySpecific(filter, sortOrder);
  return submissions.map(submissionToView);
}

/**
 * Retrieves the latest stories.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of stories in the response.
 */
exports.getStories = async (req, res) => {
  try {
    const stories = await fetchAndFormatSubmissions({ specific: "story" }, -1);
    return res.status(200).json(stories);
  } catch (err) {
    console.error("Error in getStories:", err);
    return res.status(500).json({ error: "Failed to get stories" });
  }
};

/**
 * Retrieves past stories (oldest first).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of past stories in the response.
 */
exports.getPastSubmissions = async (req, res) => {
  try {
    const stories = await fetchAndFormatSubmissions({ specific: "story" }, 1);
    return res.status(200).json(stories);
  } catch (err) {
    console.error("Error in getPastSubmissions:", err);
    return res.status(500).json({ error: "Failed to get stories" });
  }
};

/**
 * Retrieves "ask" type submissions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of "ask" submissions in the response.
 */
exports.getAskSubmissions = async (req, res) => {
  try {
    const stories = await fetchAndFormatSubmissions({ specific: "ask" }, -1);
    return res.status(200).json(stories);
  } catch (err) {
    console.error("Error in getAskSubmissions:", err);
    return res.status(500).json({ error: "Failed to get stories" });
  }
};

/**
 * Retrieves "show" type submissions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of "show" submissions in the response.
 */
exports.getShowSubmissions = async (req, res) => {
  try {
    const stories = await fetchAndFormatSubmissions({ specific: "show" }, -1);
    return res.status(200).json(stories);
  } catch (err) {
    console.error("Error in getShowSubmissions:", err);
    return res.status(500).json({ error: "Failed to get stories" });
  }
};

/**
 * Retrieves "job" type submissions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of "job" submissions in the response.
 */
exports.getJobSubmissions = async (req, res) => {
  try {
    const stories = await fetchAndFormatSubmissions({ specific: "job" }, -1);
    return res.status(200).json(stories);
  } catch (err) {
    console.error("Error in getJobSubmissions:", err);
    return res.status(500).json({ error: "Failed to get stories" });
  }
};

/**
 * Adds a vote to a submission.
 *
 * @param {Object} req - The request object containing the submission ID.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends a success message in the response.
 */
exports.voteStory = async (req, res) => {
  const { submissionId } = req.params;

  const submission = await findSubmissionById(submissionId);

  if (submission.votes.includes(req.user.id)) {
    return res.status(400).json({ error: "You have already voted" });
  }

  await addToSubmissionVotesArray(req.user.id, submission);

  res.status(200).json({ message: "Voted successfully" });
};

/**
 * Removes a vote from a submission.
 *
 * @param {Object} req - The request object containing the submission ID.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends a success message in the response.
 */
exports.unvoteSubmission = async (req, res) => {
  const { submissionId } = req.params;

  const submission = await findSubmissionById(submissionId);
  await unvoteSubmissionUtil(submission, req.user.id);

  res.status(200).json({ message: "Vote removed successfully" });
};

/**
 * Retrieves the owner of a submission.
 *
 * @param {Object} req - The request object containing the submission ID.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the owner's information in the response.
 */
exports.getSubmissionOwner = async (req, res) => {
  const { submissionId } = req.params;

  const submission = await findSubmissionById(submissionId);
  const user = await findUserById(submission.by);

  const ownerView = userToView(user);
  res.status(200).json(ownerView);
};

/**
 * Retrieves submissions from the past day.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of submissions in the response.
 */
exports.getSubmissionsByDay = async (req, res) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const submissions = await findSubmissionfromCreatedAt(yesterday);

  const formatted = submissions.map(submissionToView);
  res.status(200).json(formatted);
};

/**
 * Retrieves submissions from the past month.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of submissions in the response.
 */
exports.getSubmissionsByMonth = async (req, res) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const submissions = await findSubmissionfromCreatedAt(lastMonth);

  const formatted = submissions.map(submissionToView);
  res.status(200).json(formatted);
};

/**
 * Retrieves submissions from the past year.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Sends the list of submissions in the response.
 */
exports.getSubmissionsByYear = async (req, res) => {
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  const submissions = await findSubmissionfromCreatedAt(lastYear);

  const formatted = submissions.map(submissionToView);
  res.status(200).json(formatted);
};
