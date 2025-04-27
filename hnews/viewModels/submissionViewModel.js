
 function submissionToView(submissionDoc) {
    return {
      id: submissionDoc._id,
      title: submissionDoc.title,
      votesCount: submissionDoc.votes ? submissionDoc.votes.length : 0, 
      by: submissionDoc.by?.username || null, // username from by
      createdAt: submissionDoc.createdAt,
    };
  }
  
  module.exports = { submissionToView };
  