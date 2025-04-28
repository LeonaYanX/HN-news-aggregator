const {
  findUserById,
  blockingUserByType,
  unblockUser,
  getAllUsers,
  findUserByUsernameAdmin
} = require('../utils/UserService');
const { deleteSubmissionById } = require('../utils/submissionService');
const { findCommentById, deleteCommentWithChildren } = require('../utils/commentService');
const { userToView } = require('../viewModels/userViewModel');

// Block User
exports.blockUser = async (req, res) => {
  const { userId } = req.params;
  const { blockingType } = req.body;

  
    await findUserById(userId);
    await blockingUserByType(userId, blockingType);

    res.status(200).json({ message: 'User blocked successfully.' });

};

// Unblock User
exports.unblockUser = async (req, res) => {
  const { userId } = req.params;


    await findUserById(userId);
    await unblockUser(userId);

    res.status(200).json({ message: 'User unblocked successfully.' });
 
};

// Delete Submission
exports.deleteSubmission = async (req, res) => {
  const { submissionId } = req.params;

    await deleteSubmissionById(submissionId);

    res.status(200).json({ message: 'Submission deleted successfully.' });
 
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

 
    const comment = await findCommentById(commentId);
    await deleteCommentWithChildren(commentId);

   res.status(200)
   .json({ message: 'Comment and its children deleted successfully.', comment });

};

// Get All Users
exports.getAllUsers = async (req, res) => {
 
    const users = await getAllUsers();
    const usersView = users.map(userToView);

    res.status(200).json({ message: 'User list retrieved successfully.', users: usersView });
};

// Find User by Username
exports.findUserByUsername = async (req, res) => {
  const { username } = req.query;


    const user = await findUserByUsernameAdmin(username);

    const userView = userToView(user);

    res.status(200).json({ user: userView });
};
