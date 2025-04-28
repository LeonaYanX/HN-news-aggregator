const User = require('../models/User');
const bcrypt = require('bcrypt');
const Submission = require('../models/Submission');
const Comment = require('../models/Comment');
const {deleteCommentWithChildren} = require('../utils/commentService');
const {updateUserAbout, findUserById, addSubmissionToFavorites} 
= require('../utils/UserService');

const { userToView } = require('../viewModels/userViewModel');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    res.status(200).json(userToView(user));
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update user "about" field
exports.updateProfile = async (req, res) => {
  const { about } = req.body;

  try {
    const user = await findUserById(req.user.id);
    
    await updateUserAbout(about, user);

    res.status(200).json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Favorite a submission
exports.favoriteSubmission = async (req, res) => {
  const { submissionId } = req.params; // on click

  try { 
    await addSubmissionToFavorites(submissionId, req.user.id );
    
    res.status(200).json({ message: 'Added to favorites' });
  } catch (err) {
    console.error('Error favoriting submission:', err);
    res.status(500).json({ error: 'Failed to favorite submission' });
  }
};

// Favorite a comment
//todo utils adding from here
exports.favoriteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { favoriteComments: commentId } });

    res.status(200).json({ message: 'Added comment to favorites' });
  } catch (err) {
    console.error('Error favoriting comment:', err);
    res.status(500).json({ error: 'Failed to favorite comment' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // comparing old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // hashing new pass
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// delete submission from favorites
exports.unfavoriteSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Deleting submissionId from favoriteSubmissions array
    const index = user.favoriteSubmissions.indexOf(submissionId);
    if (index === -1) {
      return res.status(400).json({ error: 'Submission not found in favorites' });
    }

    user.favoriteSubmissions.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Submission removed from favorites' });

  } catch (err) {
    console.error('Error unfavoriting submission:', err);
    res.status(500).json({ error: 'Failed to remove submission from favorites' });
  }
};

// Delete comment from favorites
exports.unfavoriteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // deleting commentId from favoriteComments array
    const index = user.favoriteComments.indexOf(commentId);
    if (index === -1) {
      return res.status(400).json({ error: 'Comment not found in favorites' });
    }

    user.favoriteComments.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Comment removed from favorites' });

  } catch (err) {
    console.error('Error unfavoriting comment:', err);
    res.status(500).json({ error: 'Failed to remove comment from favorites' });
  }
};

// Delete own submission
exports.deleteOwnSubmission = async (req, res) => {
    try {
      const { submissionId } = req.params; // from req string
      const userId = req.user.id;           // from token it's string
  
      // getting submission by id
      const submission = await Submission.findById(submissionId);
  
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }
  
      // checking if the user is the submission owner
      if (submission.by.toString() !== userId) { // submission.by is mongo Obj
        return res.status(403).json({ message: 'You can delete only your own submissions' });
      }
  
     // finding all base comments
    const comments = await Comment.find({ onSubmission: submission._id });

    // deleting each one with children
    for (const comment of comments) {
      await deleteCommentWithChildren(comment._id);
    }
  
      // deleting submission
      await submission.deleteOne();
  
      // Updating user and deleting submission from submissions array
      await User.findByIdAndUpdate(userId, {
        $pull: { submissions: submission._id }
      });
  
      res.status(200).json({ message: 'Submission deleted successfully' });
  
    } catch (err) {
      console.error('Error deleting own submission', err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  // Vote for user (increase karma)
exports.voteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { karma: 1 } },
      { new: true } // return updated user
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User upvoted', karma: user.karma });
  } catch (err) {
    console.error('Error upvoting user:', err);
    res.status(500).json({ error: 'Failed to upvote user' });
  }
};
