const Comment = require("../models/Comment");

/**
 * Checks whether a comment has a parent.
 *
 * @param {!Object} comment The comment document to check.
 * @returns {boolean} True if the comment has a parent, false otherwise.
 * @throws {Object} If the comment is not provided.
 */
async function isThereAParent(comment) {
  if (!comment) {
    throw { status: 400, message: "Comment required." };
  }
  return !!comment.parent;
}

/**
 * Finds a comment by its ID.
 *
 * @param {string} commentId The ID of the comment to find.
 * @returns {!Object} The found comment document.
 * @throws {Object} If commentId is missing or the comment is not found.
 */
async function findCommentById(commentId) {
  if (!commentId) {
    throw { status: 400, message: "commentId required." };
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw { status: 404, message: "Comment not found." };
  }
  return comment;
}

/**
 * Recursively deletes a comment and all its child comments.
 *
 * @param {string} commentId The ID of the comment to delete.
 * @returns {undefined}
 * @throws {Object} If commentId is missing.
 */
async function deleteCommentWithChildren(commentId) {
  if (!commentId) {
    throw { status: 400, message: "Comment id required." };
  }

  // Retrieve the base comment
  const comment = await findCommentById(commentId);
  // Find direct children of this comment
  const childComments = await Comment.find({ parent: commentId });

  // Recursively delete each child comment first
  for (const child of childComments) {
    await deleteCommentWithChildren(child._id);
  }

  // Delete the base comment after its children
  await comment.deleteOne();
}

/**
 * Retrieves the parent comment of a given comment.
 *
 * @param {!Object} comment The comment whose parent is requested.
 * @returns {?Object} The parent comment document, or null if none.
 * @throws {Object} If the comment is not provided.
 */
async function getParentComment(comment) {
  if (!comment) {
    throw { status: 400, message: "Comment is required." };
  }

  // Populate only the username of the parent’s author
  const parentComment = await Comment.findById(comment.parent)
    .populate("userId", "username")
    .lean();

  return parentComment || null;
}

/**
 * Creates a new comment under a submission (and optionally as a reply).
 *
 * @param {string} userId The ID of the commenting user.
 * @param {string} text The comment text.
 * @param {string} submissionId The ID of the submission being commented on.
 * @param {?string=} parentId The ID of the parent comment (for replies).
 * @returns {!Object} The newly created comment document.
 * @throws {Object} If any required parameter is missing.
 */
async function createNewComment(userId, text, submissionId, parentId = null) {
  if (!userId || !text || !submissionId) {
    throw { status: 400, message: "Missing parameters for new comment." };
  }

  const comment = new Comment({
    userId,
    text,
    parent: parentId,
    onSubmission: submissionId,
  });

  await comment.save();
  return comment;
}

/**
 * Finds the first child comment of a given comment.
 *
 * @param {!Object} comment The comment whose child is requested.
 * @returns {?Object} The first child comment document, or null if none.
 * @throws {Object} If the comment is not provided.
 */
async function findingChildComment(comment) {
  if (!comment) {
    throw { status: 400, message: "Comment is required." };
  }

  const nextComment = await Comment.findOne({ parent: comment._id })
    .select("_id")
    .lean();

  return nextComment || null;
}

/**
 * Retrieves all comments under a given submission, sorted oldest first.
 *
 * @param {string} submissionId The ID of the submission.
 * @returns {!Array<Object>} Array of comment documents.
 * @throws {Object} If submissionId is missing.
 */
async function getAllCommentsOfSubmission(submissionId) {
  if (!submissionId) {
    throw { status: 400, message: "Submission id is required." };
  }

  const comments = await Comment.find({ onSubmission: submissionId })
    .sort({ createdAt: 1 })
    .populate("userId", "username")
    .lean();

  return comments;
}

/**
 * Updates the votes array on a comment, either upvoting or removing an upvote.
 *
 * @param {!Object} comment The comment document to update.
 * @param {string} userId The ID of the voting user.
 * @param {number=} votingType 1 to upvote, -1 to remove vote.
 * @returns {undefined}
 * @throws {Object} If comment is missing or votingType is invalid.
 */
async function updateCommentVotes(comment, userId, votingType = 1) {
  if (!comment) {
    throw { status: 400, message: "Comment is required." };
  }

  if (votingType === 1) {
    comment.votes.push(userId);
  } else if (votingType === -1) {
    const voteIndex = comment.votes.indexOf(userId);
    if (voteIndex === -1) {
      throw { status: 400, message: "You have not voted for this comment." };
    }
    comment.votes.splice(voteIndex, 1);
  } else {
    throw { status: 400, message: "Undefined voting type." };
  }

  await comment.save();
}

/**
 * Finds a comment by ID and populates its submission (for URL access).
 *
 * @param {string} commentId The ID of the comment.
 * @returns {!Object} The comment document with populated onSubmission.
 * @throws {Object} If commentId is missing or not found.
 */
async function findByIdWithSubmUrlAccess(commentId) {
  if (!commentId) {
    throw { status: 400, message: "Comment id is required." };
  }

  const comment = await Comment.findById(commentId).populate("onSubmission");

  if (!comment) {
    throw { status: 404, message: "Comment not found." };
  }

  return comment;
}

/**
 * Finds the previous comment in chronological order under the same submission.
 *
 * @param {!Object} comment The reference comment.
 * @returns {?Object} The previous comment document, or null if none.
 * @throws {Object} If the comment is not provided.
 */
async function findPrevComment(comment) {
  if (!comment) {
    throw { status: 400, message: "Comment is required." };
  }

  const previousComment = await Comment.findOne({
    createdAt: { $lt: comment.createdAt },
    onSubmission: comment.onSubmission,
  }).sort({ createdAt: -1 });

  return previousComment || null;
}

/**
 * Finds the next comment in chronological order under the same submission.
 *
 * @param {!Object} comment The reference comment.
 * @returns {?Object} The next comment document, or null if none.
 * @throws {Object} If the comment is not provided.
 */
async function getNextComment(comment) {
  if (!comment) {
    throw { status: 400, message: "Comment is required." };
  }

  const nextComment = await Comment.findOne({
    createdAt: { $gt: comment.createdAt },
    onSubmission: comment.onSubmission,
  }).sort({ createdAt: 1 });

  return nextComment || null;
}

/**
 * Finds all direct child comments (replies) of a given comment.
 *
 * @param {string} commentId The ID of the parent comment.
 * @returns {!Array<Object>} Array of child comment documents.
 * @throws {Object} If commentId is missing.
 */
async function findAllChildComments(commentId) {
  if (!commentId) {
    throw { status: 400, message: "Comment id is required." };
  }

  const childrenComments = await Comment.find({ parent: commentId }).sort({
    createdAt: 1,
  });

  return childrenComments;
}

/**
 * Retrieves every comment in the database, sorted oldest first,
 * and populates both the comment author’s username and the
 * submission’s title and URL.
 *
 * @returns {!Array<Object>} Array of plain comment objects.
 */
async function getAllCommentsFromDB() {
  const comments = await Comment.find()
    .sort({ createdAt: 1 })
    .populate({ path: "userId", select: "username" })
    .populate({ path: "onSubmission", select: "title url" })
    .lean();

  return comments;
}

module.exports = {
  deleteCommentWithChildren,
  findCommentById,
  createNewComment,
  isThereAParent,
  getParentComment,
  findingChildComment,
  getAllCommentsOfSubmission,
  updateCommentVotes,
  findByIdWithSubmUrlAccess,
  findPrevComment,
  getNextComment,
  findAllChildComments,
  getAllCommentsFromDB,
};
