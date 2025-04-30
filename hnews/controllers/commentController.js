// controllers/commentController.js

const {
  createNewComment,
  findCommentById,
  isThereAParent,
  getParentComment,
  getAllCommentsOfSubmission,
  updateCommentVotes,
  findByIdWithSubmUrlAccess,
  findPrevComment,
  findAllChildComments,
  getAllCommentsFromDB,
} = require("../utils/commentService");

const {
  findSubmissionById,
  updateSubmissionCommentsArrayPush,
} = require("../utils/submissionService");

const {
  findUserById,
  addCommentToUserCommentArray,
} = require("../utils/UserService");

const { commentViewModel } = require("../viewModels/commentViewModel");
const { userViewModel } = require("../viewModels/userViewModel");
const { submissionViewModel } = require("../viewModels/submissionViewModel");
const {
  commentContextViewModel,
} = require("../viewModels/commentContextViewModel");

/**
 * Creates a new comment for a submission.
 *
 * @param {Object} req - Express request object containing user and comment text.
 * @param {Object} res - Express response object.
 */
exports.createComment = async (req, res) => {
  const { text } = req.body;
  const { submissionId } = req.params;

  // Create a new comment associated with the submission and user.
  const comment = await createNewComment(req.user.id, text, submissionId);

  // Update the submission's comments array.
  const submission = await findSubmissionById(submissionId);
  await updateSubmissionCommentsArrayPush(submission, comment);

  // Add the comment to the user's comment array.
  const user = await findUserById(req.user.id);
  await addCommentToUserCommentArray(user, comment);

  res.status(201).json({ message: "Comment created successfully." });
};

/**
 * Retrieves all comments for a specific submission.
 *
 * @param {Object} req - Express request object containing submission ID.
 * @param {Object} res - Express response object.
 */
exports.getCommentsForSubmission = async (req, res) => {
  const { submissionId } = req.params;

  // Fetch all comments associated with the submission.
  const comments = await getAllCommentsOfSubmission(submissionId);

  // Format comments for the response.
  const formattedComments = comments.map((comment) =>
    commentViewModel(comment)
  );

  res.status(200).json(formattedComments);
};

/**
 * Registers a vote for a specific comment.
 *
 * @param {Object} req - Express request object containing user and comment ID.
 * @param {Object} res - Express response object.
 */
exports.voteComment = async (req, res) => {
  const { commentId } = req.params;

  // Find the comment by ID.
  const comment = await findCommentById(commentId);

  // Check if the user has already voted.
  if (comment.votes.includes(req.user.id)) {
    return res
      .status(400)
      .json({ error: "You have already voted for this comment" });
  }

  // Update the comment's vote count.
  await updateCommentVotes(comment, req.user.id);

  res.status(200).json({ message: "Voted for comment successfully" });
};

/**
 * Removes a user's vote from a specific comment.
 *
 * @param {Object} req - Express request object containing user and comment ID.
 * @param {Object} res - Express response object.
 */
exports.unvoteComment = async (req, res) => {
  const { commentId } = req.params;

  // Find the comment by ID.
  const comment = await findCommentById(commentId);

  // Remove the user's vote from the comment.
  await updateCommentVotes(comment, req.user.id, -1);

  res.status(200).json({ message: "Vote removed from comment successfully" });
};

/**
 * Retrieves the parent comment of a specific comment.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getParentComment = async (req, res) => {
  const { commentId } = req.params;

  // Find the current comment by ID.
  const currentComment = await findCommentById(commentId);

  // Check if the comment has a parent.
  if (!(await isThereAParent(currentComment))) {
    return res.status(404).json({ error: "No parent comment found." });
  }

  // Retrieve and format the parent comment.
  const parentComment = await getParentComment(currentComment);
  const formattedComment = commentViewModel(parentComment);

  res.status(200).json(formattedComment);
};

/**
 * Retrieves the context of a specific comment within its submission.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getCommentContext = async (req, res) => {
  const { commentId } = req.params;

  // Find the comment with submission URL access.
  const comment = await findByIdWithSubmUrlAccess(commentId);

  // Retrieve all comments associated with the submission.
  const relatedComments = await getAllCommentsOfSubmission(
    comment.onSubmission
  );

  // Format the context for the response.
  const formattedContext = commentContextViewModel(comment, relatedComments);

  res.status(200).json(formattedContext);
};

/**
 * Retrieves the submission associated with a specific comment.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getSubmissionForComment = async (req, res) => {
  const { commentId } = req.params;

  // Find the comment by ID.
  const comment = await findCommentById(commentId);

  // Check if the comment is associated with a submission.
  if (!comment.onSubmission) {
    return res.status(404).json({ error: "Associated submission not found." });
  }

  // Retrieve and format the associated submission.
  const submission = await findSubmissionById(comment.onSubmission);
  res.status(200).json(submissionViewModel(submission));
};

/**
 * Retrieves the owner (user) of a specific comment.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getCommentOwner = async (req, res) => {
  const { commentId } = req.params;

  // Find the comment by ID.
  const comment = await findCommentById(commentId);

  // Retrieve and format the user who made the comment.
  const user = await findUserById(comment.userId);
  res.status(200).json(userViewModel(user));
};

/**
 * Retrieves the previous comment relative to a specific comment.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getPreviousComment = async (req, res) => {
  const { commentId } = req.params;

  // Find the current comment by ID.
  const comment = await findCommentById(commentId);

  // Retrieve and format the previous comment.
  const previousComment = await findPrevComment(comment);
  res.status(200).json(commentViewModel(previousComment));
};

/**
 * Retrieves the next comment relative to a specific comment.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getNextComment = async (req, res) => {
  const { commentId } = req.params;

  // Find the current comment by ID.
  const comment = await findCommentById(commentId);

  // Retrieve and format the next comment.
  const nextComment = await getNextComment(comment);
  res.status(200).json(commentViewModel(nextComment));
};

/**
 * Creates a reply to a specific parent comment.
 *
 * @param {Object} req - Express request object containing parent comment ID and reply text.
 * @param {Object} res - Express response object.
 */
exports.replyToComment = async (req, res) => {
  const { parentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  // Find the parent comment by ID.
  const parentComment = await findCommentById(parentId);

  // Create a new comment as a reply to the parent comment.
  const reply = await createNewComment(
    userId,
    text,
    parentComment.onSubmission,
    parentComment._id
  );

  res.status(201).json(commentViewModel(reply));
};

/**
 * Retrieves all child comments of a specific comment.
 *
 * @param {Object} req - Express request object containing comment ID.
 * @param {Object} res - Express response object.
 */
exports.getCommentChildren = async (req, res) => {
  const { commentId } = req.params;

  // Retrieve all child comments associated with the parent comment.
  const childrenComments = await findAllChildComments(commentId);

  // Format child comments for the response.
  const formattedChildren = childrenComments.map((c) => commentViewModel(c));

  res.status(200).json(formattedChildren);
};

/**
 * Retrieves all comments from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllComments = async (req, res) => {
  // Fetch all comments from the database.
  const comments = await getAllCommentsFromDB();

  // Format comments for the response.
  const formattedComments = comments.map((c) => commentViewModel(c));

  res.status(200).json(formattedComments);
};
