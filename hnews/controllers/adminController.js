/**
 * @fileoverview Admin controller handling user blocks, unblocks, deletions, and queries.
 */

const {
  findUserById,
  blockingUserByType,
  unblockUser,
  getAllUsers,
  findUserByUsernameAdmin,
} = require("../utils/UserService");
const { deleteSubmissionById } = require("../utils/submissionService");
const {
  findCommentById,
  deleteCommentWithChildren,
} = require("../utils/commentService");
const { userToView } = require("../viewModels/userViewModel");

/**
 * Block a user by ID and blocking type.
 * @route POST /api/admin/user/:userId/block
 * @param {string} req.params.userId - ID of the user to block.
 * @param {string} req.body.blockingType - Blocking type ("permanent" | "temporary").
 * @returns {object} Success message.
 */
exports.blockUser = async (req, res) => {
  const { userId } = req.params;
  const { blockingType } = req.body;

  await findUserById(userId);
  await blockingUserByType(userId, blockingType);

  res.status(200).json({ message: "User blocked successfully." });
};

/**
 * Unblock a previously blocked user.
 * @route POST /api/admin/user/:userId/unblock
 * @param {string} req.params.userId - ID of the user to unblock.
 * @returns {object} Success message.
 */
exports.unblockUser = async (req, res) => {
  const { userId } = req.params;

  await findUserById(userId);
  await unblockUser(userId);

  res.status(200).json({ message: "User unblocked successfully." });
};

/**
 * Delete a submission by its ID.
 * @route DELETE /api/admin/submission/:submissionId
 * @param {string} req.params.submissionId - ID of the submission to delete.
 * @returns {object} Success message.
 */
exports.deleteSubmission = async (req, res) => {
  const { submissionId } = req.params;

  await deleteSubmissionById(submissionId);

  res.status(200).json({ message: "Submission deleted successfully." });
};

/**
 * Delete a comment and all its children recursively.
 * @route DELETE /api/admin/comment/:commentId
 * @param {string} req.params.commentId - ID of the comment to delete.
 * @returns {object} Success message and deleted comment info.
 */
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await findCommentById(commentId);
  await deleteCommentWithChildren(commentId);

  res.status(200).json({
    message: "Comment and its children deleted successfully.",
    comment,
  });
};

/**
 * Get a list of all users.
 * @route GET /api/admin/users
 * @returns {object[]} Array of user view models.
 */
exports.getAllUsers = async (req, res) => {
  const users = await getAllUsers();
  const usersView = users.map(userToView);

  res.status(200).json({
    message: "User list retrieved successfully.",
    users: usersView,
  });
};

/**
 * Find a user by username (admin use).
 * @route GET /api/admin/user?username=:username
 * @param {string} req.query.username - Username to search.
 * @returns {object} User view model.
 */
exports.findUserByUsername = async (req, res) => {
  const { username } = req.query;

  const user = await findUserByUsernameAdmin(username);
  const userView = userToView(user);

  res.status(200).json({ user: userView });
};