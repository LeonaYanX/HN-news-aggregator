
 function commentToView(commentDoc) {
    return {
      id: commentDoc._id,
      by: commentDoc.userId?.username || null, // username from userId
      createdAt: commentDoc.createdAt,
      votesCount: commentDoc.votes ? commentDoc.votes.length : 0, 
      on: commentDoc.onSubmission?.url || null, // URL from onSubmission
      text: commentDoc.text,
    };
  }
  
  module.exports = { commentToView };
  