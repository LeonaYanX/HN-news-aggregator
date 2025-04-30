const { commentViewModel } = require("./commentViewModel");

/**
 * Constructs a context view model for a comment, including related comments.
 *
 * @param {Object} comment - The main comment object.
 * @param {Array<Object>} relatedComments - Array of related comment objects.
 * @return {Object} An object containing submission URL and transformed related comments.
 */
function commentContextViewModel(comment, relatedComments) {
  return {
    onSubmission: comment.onSubmission?.url || null,
    comments: relatedComments.map((c) => commentViewModel(c)),
  };
}

module.exports = { commentContextViewModel };
