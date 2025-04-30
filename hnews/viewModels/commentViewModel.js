/**
 * Transforms a comment document into a view model.
 *
 * @param {Object} commentDoc - Mongoose comment document.
 * @return {Object} A simplified view model of the comment.
 */
function commentToView(commentDoc) {
  return {
    id: commentDoc._id,
    by: commentDoc.userId?.username || null, // Username from the user who created the comment
    createdAt: commentDoc.createdAt,
    votesCount: commentDoc.votes ? commentDoc.votes.length : 0, // Number of votes
    on: commentDoc.onSubmission?.url || null, // URL of the submission the comment belongs to
    text: commentDoc.text,
  };
}

module.exports = { commentToView };
