/**
 * Transforms a submission document into a view model.
 *
 * @param {Object} submissionDoc - Mongoose submission document.
 * @return {Object} A simplified view model of the submission.
 */
function submissionToView(submissionDoc) {
  return {
    id: submissionDoc._id,
    title: submissionDoc.title,
    votesCount: submissionDoc.votes ? submissionDoc.votes.length : 0, // Number of votes
    by: submissionDoc.by?.username || null, // Username of the user who created the submission
    byId: submissionDoc.by?._id || null, // ID of the user who created the submission
    createdAt: submissionDoc.createdAt,
  };
}

module.exports = { submissionToView };
