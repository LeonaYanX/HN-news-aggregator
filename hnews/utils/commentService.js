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
  
}

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
async function createNewComment(userId, text, submissionId) {
  try {
    if(!userId || !text || !submissionId){
      throw{status:400, message: 'Some of the parameters of a new comment not found.'};
    }

     const comment = new Comment({
          userId:userId,
          text,
          parent: null,
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
}

module.exports = {deleteCommentWithChildren, findCommentById, createNewComment
  , isThereAParent, getParentComment, findingChildComment};
