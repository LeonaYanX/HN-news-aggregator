const {deleteCommentWithChildren, getAllCommentsOfSubmission} 
= require('../utils/commentService');
const { findSubmissionById, deleteSubmissionById }
= require('../utils/submissionService');
const {updateUserAbout, findUserById, addSubmissionToFavorites, addCommentToFavorite
  , isMatchOldOrigin, changePassword, unfavoriteSubmission, unfavoriteComment
  , isSubmissionOwner, deleteUsersOwnSubmission, increaseKarmaByUserId } 
= require('../utils/UserService');

const { userToView } = require('../viewModels/userViewModel');

// Get user profile
exports.getProfile = async (req, res) => {
 
    const user = await findUserById(req.user.id);
    res.status(200).json(userToView(user));
};

// Update user "about" field
exports.updateProfile = async (req, res) => {
  const { about } = req.body;


    const user = await findUserById(req.user.id);
    
    await updateUserAbout(about, user);

    res.status(200).json({ message: 'Profile updated' });
};

// Favorite a submission
exports.favoriteSubmission = async (req, res) => {
  const { submissionId } = req.params; // on click


    await addSubmissionToFavorites(submissionId, req.user.id );
    
    res.status(200).json({ message: 'Added to favorites' });
};

// Favorite a comment
exports.favoriteComment = async (req, res) => {
  const { commentId } = req.params;

    await addCommentToFavorite(req.user.id, commentId);

    res.status(200).json({ message: 'Added comment to favorites' });
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;


    const user = await findUserById(req.user.id);
    
    // comparing old password
    const isMatch = await isMatchOldOrigin(user,oldPassword); 
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // hashing new pass
    await changePassword(user, newPassword);

    res.status(200).json({ message: 'Password updated successfully' });
};

// delete submission from favorites
exports.unfavoriteSubmission = async (req, res) => {
  const { submissionId } = req.params;


    const user = await findUserById(req.user.id);

    // Deleting submissionId from favoriteSubmissions array
    await unfavoriteSubmission(user, submissionId );

    res.status(200).json({ message: 'Submission removed from favorites' });
};

// Delete comment from favorites
exports.unfavoriteComment = async (req, res) => {
  const { commentId } = req.params;

    const user = await findUserById(req.user.id);

    // deleting commentId from favoriteComments array
    await unfavoriteComment(user, commentId);

    res.status(200).json({ message: 'Comment removed from favorites' });
};

// Delete own submission
exports.deleteOwnSubmission = async (req, res) => {
      const { submissionId } = req.params; // from req string
      const userId = req.user.id;           // from token it's string
  
      // getting submission by id
      const submission = await findSubmissionById(submissionId);
  
      // checking if the user is the submission owner
      if (!(await isSubmissionOwner(submission, userId ))) { 
        return res.status(403).json({ message: 'You can delete only your own submissions' });
      }
  
     // finding all base comments
    const comments = await getAllCommentsOfSubmission(submissionId);

    // deleting each one with children
    for (const comment of comments) {
      await deleteCommentWithChildren(comment._id);
    }
  
      // deleting submission
      await deleteSubmissionById(submissionId);
  
      // Updating user and deleting submission from submissions array
      await deleteUsersOwnSubmission(submissionId,userId );
  
      res.status(200).json({ message: 'Submission deleted successfully' });
  };

  // Vote for user (increase karma)
exports.voteUser = async (req, res) => {
  const { userId } = req.params;

    await increaseKarmaByUserId(userId);

    res.status(200).json({ message: 'User upvoted' });
};
