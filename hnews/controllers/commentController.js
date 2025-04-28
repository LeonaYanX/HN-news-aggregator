const { createNewComment, findCommentById, isThereAParent, getParentComment,
  getAllCommentsOfSubmission, updateCommentVotes, findByIdWithSubmUrlAccess,
  findPrevComment, findAllChildComments } = require('../utils/commentService');

const { findSubmissionById, updateSubmissionCommentsArrayPush }
 = require('../utils/submissionService');

const { findUserById, addCommentToUserCommentArray } = require('../utils/UserService');

const { commentViewModel } = require('../viewModels/commentViewModel');

const { userViewModel } = require('../viewModels/userViewModel');

const { submissionViewModel } = require('../viewModels/submissionViewModel');

const { commentContextViewModel } = require('../viewModels/commentContextViewModel');

exports.createComment = async (req, res) => {
  const { text } = req.body;
  const { submissionId } = req.params;

  const comment = await createNewComment(req.user.id, text, submissionId);

  const submission = await findSubmissionById(submissionId);
  await updateSubmissionCommentsArrayPush(submission, comment);

  const user = await findUserById(req.user.id);
  await addCommentToUserCommentArray(user, comment);

  res.status(201).json({ message: 'Comment created successfully.' });
};

exports.getCommentsForSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const comments = await getAllCommentsOfSubmission(submissionId);
  const formattedComments = comments.map(comment => commentViewModel(comment));
  res.status(200).json(formattedComments);
};

exports.voteComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findCommentById(commentId);

  if (comment.votes.includes(req.user.id)) {
    return res.status(400).json({ error: 'You have already voted for this comment' });
  }

  await updateCommentVotes(comment, req.user.id);
  res.status(200).json({ message: 'Voted for comment successfully' });
};

exports.unvoteComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findCommentById(commentId);

  await updateCommentVotes(comment, req.user.id, -1);
  res.status(200).json({ message: 'Vote removed from comment successfully' });
};

exports.getParentComment = async (req, res) => {
  const { commentId } = req.params;
  const currentComment = await findCommentById(commentId);

  if (!(await isThereAParent(currentComment))) {
    return res.status(404).json({ error: 'No parent comment found.' });
  }

  const parentComment = await getParentComment(currentComment);
  const formattedComment = commentViewModel(parentComment);

  res.status(200).json(formattedComment);
};

exports.getCommentContext = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findByIdWithSubmUrlAccess(commentId);
  const relatedComments = await getAllCommentsOfSubmission(comment.onSubmission);

  const formattedContext = commentContextViewModel(comment, relatedComments);
  res.status(200).json(formattedContext);
};

exports.getSubmissionForComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findCommentById(commentId);

  if (!comment.onSubmission) {
    return res.status(404).json({ error: 'Associated submission not found.' });
  }

  const submission = await findSubmissionById(comment.onSubmission);
  res.status(200).json(submissionViewModel(submission));
};

exports.getCommentOwner = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findCommentById(commentId);
  const user = await findUserById(comment.userId);

  res.status(200).json(userViewModel(user));
};

exports.getPreviousComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findCommentById(commentId);
  const previousComment = await findPrevComment(comment);

  res.status(200).json(commentViewModel(previousComment));
};

exports.getNextComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await findCommentById(commentId);
  const nextComment = await getNextComment(comment);

  res.status(200).json(commentViewModel(nextComment));
};

exports.replyToComment = async (req, res) => {
  const { parentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  const parentComment = await findCommentById(parentId);
  const reply = await createNewComment(userId, text, parentComment.onSubmission, parentComment._id);

  res.status(201).json(commentViewModel(reply));
};

exports.getCommentChildren = async (req, res) => {
  const { commentId } = req.params;
  const childrenComments = await findAllChildComments(commentId);
  const formattedChildren = childrenComments.map(c => commentViewModel(c));

  res.status(200).json(formattedChildren);
};
