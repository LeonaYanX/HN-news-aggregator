const Comment = require('../models/Comment');

// reqursive func to delete all comments with children
const deleteCommentWithChildren = async (commentId) => {
  // finding all children
  const childComments = await Comment.find({ parent: commentId });

  // deleting children reqursiv
  for (const child of childComments) {
    await deleteCommentWithChildren(child._id);
  }

  // deleting the base comment
  await Comment.findByIdAndDelete(commentId);
};

module.exports = deleteCommentWithChildren;
