const Comment = require('../models/Comment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const{ createNewComment, findCommentById, isThereAParent, getParentComment } 
= require('../utils/commentService');
const { findSubmissionById, updateSubmissionCommentsArrayPush } 
= require('../utils/submissionService');
const { findUserById, addCommentToUserCommentArray } = require('../utils/UserService');

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
    
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get all comments for a submission with compact info
exports.getCommentsForSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const comments = await Comment.find({ onSubmission: submissionId })
      .sort({ createdAt: 1 }) // oldest first
      .populate('userId', 'username') 
      .lean(); //not mongoose-docs obj

    const formattedComments = comments.map(comment => ({
      _id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      userId: comment.userId ? { _id: comment.userId._id, username: comment.userId.username } : null,
      parent: comment.parent || null, // id of a parent
      onSubmission: comment.onSubmission || null, // id 
      votesCount: comment.votes ? comment.votes.length : 0, 
    }));

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
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // checking if already voted
      if (comment.votes.includes(req.user.id)) {
        return res.status(400).json({ error: 'You have already voted for this comment' });
      }
  
      comment.votes.push(req.user.id);

      await comment.save();
  
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
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    
    const voteIndex = comment.votes.indexOf(req.user.id);
    if (voteIndex === -1) {
      return res.status(400).json({ error: 'You have not voted for this comment' });
    }

    
    comment.votes.splice(voteIndex, 1);
    await comment.save();

    res.status(200).json({ message: 'Vote removed from comment successfully' });
  } catch (err) {
    console.error('Error unvoting comment:', err);
    res.status(500).json({ error: 'Failed to remove vote from comment' });
  }
};

// Get detailed parent comment info
exports.getParentComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const currentComment = await findCommentById(commentId);

    // Chacking for parent
    if ((await isThereAParent(currentComment))) {

     const parentComment = await getParentComment(currentComment);
     const grandparent = await getParentComment(parentComment);
    }
//todo
    // Ищем "child" — то есть комментарий, который ссылается на parent
    const nextComment = await Comment.findOne({ parent: parentComment._id })
      .select('_id')
      .lean();

    // Ответ для фронта
    const response = {
      _id: parentComment._id,
      text: parentComment.text,
      createdAt: parentComment.createdAt,
      userId: parentComment.userId ? { _id: parentComment.userId._id, username: parentComment.userId.username } : null,
      parent: grandParentId,            // родитель родителя
      context: parentComment.onSubmission, // контекст — сабмишн
      next: nextComment ? nextComment._id : null, // первый найденный дочерний комментарий
    };

    res.status(200).json(response);

  } catch (err) {
    console.error('Error getting parent comment details:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

  
  
  // Get context of a comment 
  exports.getCommentContext = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await Comment.findById(commentId)
      .populate('parent')
      .populate('onSubmission');
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const relatedComments = await Comment.find({
        onSubmission: comment.onSubmission._id
      }).populate('parent');
      
  
      res.status(200).json({
        comment,
        relatedComments
      });
      
    } catch (err) {
      console.error('Error getting comment context', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  //Get submission on which comment is done
  exports.getSubmissionForComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await Comment.findById(commentId);
      if (!comment || !comment.onSubmission) {
        return res.status(404).json({ message: 'Comment or associated submission not found' });
      }
  
      const submission = await Submission.findById(comment.onSubmission);
  
      res.status(200).json(submission);
    } catch (err) {
      console.error('Error getting submission for comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  //Get comment owner (userInfo)
  exports.getCommentOwner = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const user = await User.findById(comment.userId).select('username karma about createdAt');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error('Error getting comment owner', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  //Get previous comment (by createdAt)
  exports.getPreviousComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const previousComment = await Comment.findOne({
        createdAt: { $lt: comment.createdAt },
        onSubmission: comment.onSubmission
      }).sort({ createdAt: -1 }); // taking last before our 
  
      if (!previousComment) {
        return res.status(404).json({ message: 'No previous comment' });
      }
  
      res.status(200).json(previousComment);
    } catch (err) {
      console.error('Error getting previous comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  //Get next comment (by createdAt)
  exports.getNextComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const nextComment = await Comment.findOne({
        createdAt: { $gt: comment.createdAt },// grater than
        onSubmission: comment.onSubmission
      }).sort({ createdAt: 1 }); 
  
      if (!nextComment) {
        return res.status(404).json({ message: 'No next comment' });
      }
  
      res.status(200).json(nextComment);
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
      const userId = req.user.id; // from token
  
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
  
      const reply = new Comment({
        userId: userId,
        text: text,
        parent: parentComment._id,
        onSubmission: parentComment.onSubmission,
      });
  
      await reply.save();
  
      res.status(201).json(reply);
    } catch (err) {
      console.error('Error replying to comment', err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  //Get children (replies) of a comment
exports.getCommentChildren = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      // getting all comments where parent = our commentId
      const childrenComments = await Comment.find({ parent: commentId }).sort({ createdAt: 1 });
  
      res.status(200).json(childrenComments);
    } catch (err) {
      console.error('Error getting child comments', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  
