const Comment = require('../models/Comment');

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

module.exports = {deleteCommentWithChildren, findCommentById};
