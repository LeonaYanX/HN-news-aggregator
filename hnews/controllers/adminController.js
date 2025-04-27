const {findUserById, blockingUserByType, unblockUser, getAllUsers, findUserByUsernameAdmin} 
= require('../utils/UserService');
const {deleteSubmissionById} = require('../utils/submissionService');
const {findCommentById, deleteCommentWithChildren} = require('../utils/commentService');
const { userToView } = require('../viewModels/userViewModel');
//Block user
exports.blockUser = async (req,res)=>{
    const {userId} = req.params;
    const{blockingType} = req.body;  // blockingType 'temporary'(7 days),'permanent' 
    try{
       await findUserById(userId);
       await blockingUserByType(userId, blockingType);
        res.status(200).json({ message: 'User blocked'});
    }catch(err){
        console.error('Block user error', err);
        res.status(500).json({error: 'Failed to block user'});
    }
};

//Unblock User
exports.unblockUser = async (req,res) => {
    const {userId} = req.params;
    // will it be better to write not body but req.params to give info by click
    try{
      
       await findUserById(userId);
       await unblockUser(userId);

       res.status(200).json({ message: 'User unblocked' });

    }catch(err){
        console.error('Unblock user error', err);
        res.status(500).json({ error: 'Failed to unblock user' });
    }
};
// delete submission
exports.deleteSubmission = async (req, res) => {
    const {submissionId} = req.params;
    try {
       
       await deleteSubmissionById(submissionId);

       res.status(200).json({ message: 'Submission deleted'});

      } catch (err) {
        console.error('Delete submission error', err);
        res.status(500).json({ error: 'Failed to delete submission' });
      }
    };

    //delete comment
    exports.deleteComment = async (req, res) => {
        const { commentId } = req.params;
        try {
          const comment = await findCommentById(commentId);
          await deleteCommentWithChildren(commentId); 
          res.status(200).json({ message: 'Comment deleted' , comment});
        } catch (err) {
            console.error('Delete comment error', err);
          res.status(500).json({ error: 'Failed to delete comment' });
        }
      };

      // getting all users 
exports.getAllUsers = async (req, res) => {
  try {
      const users = await getAllUsers();
      const usersView = users.map(userToView);  

      res.status(200).json({ message: 'User list', users: usersView });
  } catch (err) {
      console.error('Error getting users list', err);
      res.status(500).json({ message: 'Error getting users list' });
  }
};

  //find user by username 
exports.findUserByUsername = async (req, res) => {
  try {
      const { username } = req.body;
      const user = await findUserByUsernameAdmin(username);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const userView = userToView(user);

      res.status(200).json({ user: userView });
  } catch (err) {
      console.error('Find user by username error:', err);
      res.status(500).json({ error: 'Server error' });
  }
};
      


