const Comment = require('../models/Comment');


async function isThereAParent(comment) {
try {
  if(!comment){
    throw {status:400, message:'Comment required.'};
  }
  return !!comment.parent;

} catch (error) {
  throw error
}
}
//Finds comment by id with if tests returns comment

async function findCommentById(commentId) {
  try{
    if(!commentId){
      throw {status: 400, message: 'commentId required.'};
    }
    const comment = await Comment.findById(commentId);
    if(!comment){
      throw {status: 404, message: 'Comment is not found.'};
    }

    return comment;

  }catch(err){
    throw err;
  }
  
};

// reqursive func to delete all comments with children
async function deleteCommentWithChildren (commentId)  {

  // finding all children
  try{ 
    if(!commentId){
      throw {status:400, message:'Comment id required'}
    }
   
    const comment = await findCommentById(commentId);

    const childComments = await Comment.find({ parent: commentId });
   if(childComments.length<=0){

    await Comment.findByIdAndDelete(commentId);
   }
   else{
// deleting children reqursiv

for (const child of childComments) {
    
  await deleteCommentWithChildren(child._id);
}

// deleting the base comment
 await comment.deleteOne();

   }

   return true;

  }catch(err){

    throw err;
  }
 
};

async function getParentComment(comment) {
  try {
    if(!comment){
      throw {status:400, message:'Comment is required'}
    }
   // finding parent
      const parentComment = await Comment.findById(comment.parent)
        .populate('userId', 'username')
        .lean();
  
      if (!parentComment) {
        return null;
      }  
      else{
        return parentComment;
      }
  } catch (error) {
    throw error;
  }
};

//create new comment on submission
async function createNewComment(userId, text, submissionId, parentId=null) {
  try {
    if(!userId || !text || !submissionId){
      throw{status:400, message: 'Some of the parameters of a new comment not found.'};
    }

     const comment = new Comment({
          userId:userId,
          text,
          parent: parentId,
          onSubmission: submissionId
        });
    
        await comment.save();

        return comment;

  } catch (error) {
    throw error;
  }
};
// returns nextComment or null
async function findingChildComment(comment) {
  try {
    if(!comment){
      throw {status:400, message:'Comment is required'};
    }
    
    const nextComment = await Comment.findOne({ parent: comment._id })
          .select('_id')
          .lean();
    if(!nextComment){
      return null;
    }
    else{
      return nextComment;
    }
    
  } catch (error) {
    throw error;
  }
};
// Getting All comments of the submission

async function getAllCommentsOfSubmission(submissionId) {
  try {
    if(!submissionId){
      throw{status: 400, message: 'Submission id is required.'};
    }

    const comments = await Comment.find({ onSubmission: submissionId })
          .sort({ createdAt: 1 })
          .populate('userId', 'username')
          .lean();
    return comments;

  } catch (error) {
    throw error;
  }
};
//updating comment votes upvote or downvote
async function updateCommentVotes(comment, userId, votingType=1) {
  try {
    if(!comment){
      throw {status:400, message: 'Comment is required.'};
    }
    if(votingType===1){
      comment.votes.push(userId);

      await comment.save();

      return true;
    }
    else if(votingType===-1){
      const voteIndex = comment.votes.indexOf(userId);
      if (voteIndex === -1) {
       throw {status:400, message: 'You have not voted for this comment' };
      }
      comment.votes.splice(voteIndex, 1);
      await comment.save();
    }
    else{
      throw {status: 400, message: 'Undefined voting type.'};
    }

  } catch (error) {
    throw error;
  }
  

};

//find comment by id with poputing onSubmission for submission url
async function findByIdWithSubmUrlAccess(commentId) {
  try {
    if(!commentId){
      throw {status: 400, message:'Comment id is required.'};
    }
     const comment = await Comment.findById(commentId)
          .populate('onSubmission'); // populating onSubmission for url
    
        if (!comment) {
          throw {status:404, message: 'Comment not found' };
        }
        return comment;
  } catch (error) {
    throw error;
  }
};
//finding prev comment of the comment
async function findPrevComment(comment) {
  try {
    if(!comment){
      throw {status:400, message:'Comment is required'}
    }
     const previousComment = await Comment.findOne({
            createdAt: { $lt: comment.createdAt },
            onSubmission: comment.onSubmission
          }).sort({ createdAt: -1 }); // taking last before our 
      
          if (!previousComment) {
            return null;
          }
          return previousComment;
  } catch (error) {
    throw error;
  }
};
//Getting next comment
async function getNextComment(comment) {
  try {
    if(!comment){
      throw {status: 400, message: 'Comment is required.'}
    }
   const nextComment = await Comment.findOne({
         createdAt: { $gt: comment.createdAt },
         onSubmission: comment.onSubmission
         }).sort({ createdAt: 1 });
      
          if (!nextComment) {
            return null;
          }
          return nextComment;
  } catch (error) {
    throw error;
  }
};
// finding all child comments
async function findAllChildComments(commentId) {
  try {
    if(!commentId){
      throw{status:400, message: 'Comment id is required.'};
    }
    const childrenComments = await Comment.find({ parent: commentId })
    .sort({ createdAt: 1 });

    return childrenComments;

  } catch (error) {
    throw error;
  }
}

module.exports = {deleteCommentWithChildren, findCommentById, createNewComment
  , isThereAParent, getParentComment, findingChildComment, getAllCommentsOfSubmission
  ,updateCommentVotes, findByIdWithSubmUrlAccess, findPrevComment, getNextComment
  , findAllChildComments};
