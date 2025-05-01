const {
  deleteCommentWithChildren,
  getAllCommentsOfSubmission,
} = require("../utils/commentService");
const {
  findSubmissionById,
  deleteSubmissionById,
} = require("../utils/submissionService");
const {
  updateUserAbout,
  findUserById,
  addSubmissionToFavorites,
  addCommentToFavorite,
  isMatchOldOrigin,
  changePassword,
  unfavoriteSubmission,
  unfavoriteComment,
  isSubmissionOwner,
  deleteUsersOwnSubmission,
  increaseKarmaByUserId,
  unvoteUser
} = require("../utils/UserService");

const { userToView } = require("../viewModels/userViewModel");

/**
 * Retrieves the profile of the authenticated user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends the user profile data as JSON.
 */
exports.getProfile = async (req, res) => {
  const user = await findUserById(req.user.id);
  res.status(200).json(userToView(user));
};

/**
 * Updates the "about" section of the authenticated user's profile.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message on update.
 */
exports.updateProfile = async (req, res) => {
  const { about } = req.body;
  const user = await findUserById(req.user.id);
  
  await updateUserAbout(about, user);
  
  res.status(200).json({ message: "Profile updated" });
};

/**
 * Adds a submission to the authenticated user's list of favorites.
 *
 * @param {Object} req - Express request object with submissionId parameter.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message on adding to favorites.
 */
exports.favoriteSubmission = async (req, res) => {
  const { submissionId } = req.params; // on click
  await addSubmissionToFavorites(submissionId, req.user.id);
  res.status(200).json({ message: "Added to favorites" });
};

/**
 * Adds a comment to the authenticated user's list of favorite comments.
 *
 * @param {Object} req - Express request object with commentId parameter.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message on adding to favorites.
 */
exports.favoriteComment = async (req, res) => {
  const { commentId } = req.params;
  await addCommentToFavorite(req.user.id, commentId);
  res.status(200).json({ message: "Added comment to favorites" });
};

/**
 * Changes the password for the authenticated user after verifying the old password.
 *
 * @param {Object} req - Express request object with oldPassword and newPassword in the body.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message if the password is updated, or an error message if not.
 */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await findUserById(req.user.id);

  // Comparing the provided old password with the stored one.
  const isMatch = await isMatchOldOrigin(user, oldPassword);
  if (!isMatch) {
    return res.status(400).json({ error: "Old password is incorrect" });
  }

  // Updating with the new password.
  await changePassword(user, newPassword);
  res.status(200).json({ message: "Password updated successfully" });
};

/**
 * Removes a submission from the authenticated user's favorites.
 *
 * @param {Object} req - Express request object with submissionId parameter.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message once the submission is removed.
 */
exports.unfavoriteSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const user = await findUserById(req.user.id);

  // Deleting submissionId from the favoriteSubmissions array.
  await unfavoriteSubmission(user, submissionId);
  res.status(200).json({ message: "Submission removed from favorites" });
};

/**
 * Removes a comment from the authenticated user's favorites.
 *
 * @param {Object} req - Express request object with commentId parameter.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message once the comment is removed.
 */
exports.unfavoriteComment = async (req, res) => {
  const { commentId } = req.params;
  const user = await findUserById(req.user.id);

  // Deleting commentId from the favoriteComments array.
  await unfavoriteComment(user, commentId);
  res.status(200).json({ message: "Comment removed from favorites" });
};

/**
 * Deletes a submission owned by the authenticated user.
 *
 * This function also deletes all associated comments (including child comments)
 * and removes the submission from the user's submissions array.
 *
 * @param {Object} req - Express request object with submissionId parameter.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message once the submission is deleted.
 */
exports.deleteOwnSubmission = async (req, res) => {
  const { submissionId } = req.params; // from req string
  const userId = req.user.id; // from token (string)

  // Retrieve the submission by ID.
  const submission = await findSubmissionById(submissionId);

  // Check if the authenticated user is the owner of the submission.
  if (!(await isSubmissionOwner(submission, userId))) {
    return res
      .status(403)
      .json({ message: "You can delete only your own submissions" });
  }

  // Retrieve all base comments for the submission.
  const comments = await getAllCommentsOfSubmission(submissionId);

  // Delete each comment along with its child comments.
  for (const comment of comments) {
    await deleteCommentWithChildren(comment._id);
  }

  // Delete the submission and update the user record accordingly.
  await deleteSubmissionById(submissionId);
  await deleteUsersOwnSubmission(submissionId, userId);

  res.status(200).json({ message: "Submission deleted successfully" });
};

/**
 * Upvotes a user, thereby increasing their karma.
 *
 * @param {Object} req - Express request object with userId parameter.
 * @param {Object} res - Express response object.
 * @return {Promise<void>} Sends a success message once the user is upvoted.
 */
exports.voteUser = async (req, res) => {
  const { userId } = req.params;
  const {voterId} = req.user._id; // from token (string)
  const karmaCount=await increaseKarmaByUserId(userId, voterId);
  res.status(200).json({ message: "User upvoted" , karma: karmaCount });
};

exports.unvoteUser = async (req, res) => {
  const { userId } = req.params;
  const karmaCount=await unvoteUser(userId);
  res.status(200).json({ message: "User upvoted" , karma: karmaCount });
};

exports.getVoteStatus = async (req, res) => {
  const userId = req.user._id; // from token (string)
  const user = await findUserById(userId);
  const voted = user.karma.includes(userId);
  res.json({ voted });
};
