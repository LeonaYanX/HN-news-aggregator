const { commentViewModel } = require('./commentViewModel');

function commentContextViewModel(comment, relatedComments) {
    return {
        onSubmission: comment.onSubmission?.url || null, 
        comments: relatedComments.map(c => commentViewModel(c)) 
      };
};

module.exports = { commentContextViewModel };
