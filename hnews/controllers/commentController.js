const Comment = require('../models/Comment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const{ createNewComment, findCommentById, isThereAParent
  , getParentComment, findingChildComment, getAllCommentsOfSubmission
  ,updateCommentVotes, findByIdWithSubmUrlAccess, findPrevComment
  ,findAllChildComments} 
= require('../utils/commentService');
const { findSubmissionById, updateSubmissionCommentsArrayPush } 
= require('../utils/submissionService');
const { findUserById, addCommentToUserCommentArray } = require('../utils/UserService');
const { commentViewModel } = require('../viewModels/commentViewModel');
const { userViewModel } = require('../viewModels/userViewModel'); 
const { submissionViewModel } = require('../viewModels/submissionViewModel'); 
const { commentContextViewModel } = require('../viewModels/commentContextViewModel');

// Create a comment
exports.createComment = async (req, res) => {
  const { text } = req.body; 
  const { submissionId } = req.params;
  
  try {
    const comment = await createNewComment(req.user.id , text, submissionId);

    // Updating Submission and adding comment
    const submission = await findSubmissionById(submissionId);
    await updateSubmissionCommentsArrayPush(submission, comment);

    // Updating User and adding comment 
    const user = await findUserById(req.user.id);
    await addCommentToUserCommentArray(user, comment);
    
    res.status(201).json({message: 'Comment created successfully.'});
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get all comments for a submission
exports.getCommentsForSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try { 
    const comments = await getAllCommentsOfSubmission(submissionId);

    const formattedComments = comments.map(comment => commentViewModel(comment));

    res.status(200).json(formattedComments);
  } catch (err) {
    console.error('Error getting comments:', err);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};


// Vote for a comment
exports.voteComment = async (req, res) => {
    const { commentId } = req.params; // by click
  
    try {
      const comment = await findCommentById(commentId);

      // checking if already voted
      if (comment.votes.includes(req.user.id)) {
        return res.status(400).json({ error: 'You have already voted for this comment' });
      }
  
      await updateCommentVotes(comment, req.user.id);
      res.status(200).json({ message: 'Voted for comment successfully' });
    } catch (err) {
      console.error('Error voting for comment:', err);
      res.status(500).json({ error: 'Failed to vote for comment' });
    }
  };

// Unvote comment 
exports.unvoteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await findCommentById(commentId);
    await updateCommentVotes(comment, req.user.id, -1);

    res.status(200).json({ message: 'Vote removed from comment successfully' });
  } catch (err) {
    console.error('Error unvoting comment:', err);
    res.status(500).json({ error: 'Failed to remove vote from comment' });
  }
};

// Get parent comment info
exports.getParentComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const currentComment = await findCommentById(commentId);

    if (!(await isThereAParent(currentComment))) {
      return null;
    }

    const parentComment = await getParentComment(currentComment);

    const formattedComment = commentViewModel(parentComment);

    res.status(200).json(formattedComment);
  } catch (err) {
    console.error('Error getting parent comment details:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
 
  // Get context of a comment
exports.getCommentContext = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await findByIdWithSubmUrlAccess(commentId); 
    const relatedComments = await getAllCommentsOfSubmission(comment.onSubmission);

    const formattedContext = commentContextViewModel(comment, relatedComments);

    res.status(200).json(formattedContext);
  } catch (err) {
    console.error('Error getting comment context', err);
    res.status(500).json({ error: 'Server error' });
  }
};
  
  //Get submission on which comment is done
  exports.getSubmissionForComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await findCommentById(commentId);
      if (!comment.onSubmission) {
        return res.status(404).json({ message: 'Associated submission not found' });
      }
  
      const submission = await findSubmissionById(comment.onSubmission);
  
      res.status(200).json(submissionViewModel(submission));
    } catch (err) {
      console.error('Error getting submission for comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Get comment owner
exports.getCommentOwner = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await findCommentById(commentId);

    const user = await findUserById(comment.userId);

    res.status(200).json(userViewModel(user));
  } catch (err) {
    console.error('Error getting comment owner', err);
    res.status(500).json({ error: 'Server error' });
  }
};
  
  //Get previous comment (by createdAt)
  exports.getPreviousComment = async (req, res) => {
    try {
      const { commentId } = req.params;
 
      const comment = await findCommentById(commentId);
      const previousComment = await findPrevComment(comment);
  
      res.status(200).json(commentViewModel(previousComment));
    } catch (err) {
      console.error('Error getting previous comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  //Get next comment (by createdAt)
  exports.getNextComment = async (req, res) => {
    try {
      const { commentId } = req.params;
   
      const comment = await findCommentById(commentId);
      const nextComment = await getNextComment(comment); 
      res.status(200).json(commentViewModel(nextComment));
    } catch (err) {
      console.error('Error getting next comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  // Reply to a comment (login needed)
  exports.replyToComment = async (req, res) => {
    try {
      const { parentId } = req.params;
      const { text } = req.body;
      const userId = req.user.id;
  
      const parentComment = await findCommentById(parentId);
      const reply = await createNewComment(userId, text, parentComment.onSubmission
        , parentComment._id  );
  
      res.status(201).json(commentViewModel(reply));
    } catch (err) {
      console.error('Error replying to comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  //Get children (replies) of a comment
  exports.getCommentChildren = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const childrenComments = await findAllChildComments(commentId);
  
      const formattedChildren = childrenComments.map(c => commentViewModel(c));
  
      res.status(200).json(formattedChildren);
    } catch (err) {
      console.error('Error getting child comments', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  

  
