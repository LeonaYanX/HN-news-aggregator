const Comment = require('../models/Comment');

async function isThereAParent(comment) {
  if (!comment) {
    throw { status: 400, message: 'Comment required.' };
  }
  return !!comment.parent;
}

async function findCommentById(commentId) {
  if (!commentId) {
    throw { status: 400, message: 'commentId required.' };
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw { status: 404, message: 'Comment not found.' };
  }
  return comment;
}

async function deleteCommentWithChildren(commentId) {
  if (!commentId) {
    throw { status: 400, message: 'Comment id required.' };
  }

  const comment = await findCommentById(commentId);
  const childComments = await Comment.find({ parent: commentId });

  if (childComments.length > 0) {
    for (const child of childComments) {
      await deleteCommentWithChildren(child._id);
    }
  }

  await comment.deleteOne();
}

async function getParentComment(comment) {
  if (!comment) {
    throw { status: 400, message: 'Comment is required.' };
  }
  
  const parentComment = await Comment.findById(comment.parent)
    .populate('userId', 'username')
    .lean();

  return parentComment || null;
}

async function createNewComment(userId, text, submissionId, parentId = null) {
  if (!userId || !text || !submissionId) {
    throw { status: 400, message: 'Missing parameters for new comment.' };
  }

  const comment = new Comment({
    userId,
    text,
    parent: parentId,
    onSubmission: submissionId
  });

  await comment.save();
  return comment;
}

async function findingChildComment(comment) {
  if (!comment) {
    throw { status: 400, message: 'Comment is required.' };
  }

  const nextComment = await Comment.findOne({ parent: comment._id })
    .select('_id')
    .lean();
  
  return nextComment || null;
}

async function getAllCommentsOfSubmission(submissionId) {
  if (!submissionId) {
    throw { status: 400, message: 'Submission id is required.' };
  }

  const comments = await Comment.find({ onSubmission: submissionId })
    .sort({ createdAt: 1 })
    .populate('userId', 'username')
    .lean();
  
  return comments;
}

async function updateCommentVotes(comment, userId, votingType = 1) {
  if (!comment) {
    throw { status: 400, message: 'Comment is required.' };
  }

  if (votingType === 1) {
    comment.votes.push(userId);
  } else if (votingType === -1) {
    const voteIndex = comment.votes.indexOf(userId);
    if (voteIndex === -1) {
      throw { status: 400, message: 'You have not voted for this comment.' };
    }
    comment.votes.splice(voteIndex, 1);
  } else {
    throw { status: 400, message: 'Undefined voting type.' };
  }

  await comment.save();
}

async function findByIdWithSubmUrlAccess(commentId) {
  if (!commentId) {
    throw { status: 400, message: 'Comment id is required.' };
  }

  const comment = await Comment.findById(commentId)
    .populate('onSubmission');

  if (!comment) {
    throw { status: 404, message: 'Comment not found.' };
  }

  return comment;
}

async function findPrevComment(comment) {
  if (!comment) {
    throw { status: 400, message: 'Comment is required.' };
  }

  const previousComment = await Comment.findOne({
    createdAt: { $lt: comment.createdAt },
    onSubmission: comment.onSubmission
  }).sort({ createdAt: -1 });

  return previousComment || null;
}

async function getNextComment(comment) {
  if (!comment) {
    throw { status: 400, message: 'Comment is required.' };
  }

  const nextComment = await Comment.findOne({
    createdAt: { $gt: comment.createdAt },
    onSubmission: comment.onSubmission
  }).sort({ createdAt: 1 });

  return nextComment || null;
}

async function findAllChildComments(commentId) {
  if (!commentId) {
    throw { status: 400, message: 'Comment id is required.' };
  }

  const childrenComments = await Comment.find({ parent: commentId })
    .sort({ createdAt: 1 });

  return childrenComments;
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
  findAllChildComments
};
