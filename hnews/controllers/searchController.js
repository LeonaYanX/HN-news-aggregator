const { userToView } = require("../viewModels/userViewModel");
const { submissionToView } = require("../viewModels/submissionViewModel");
const { commentToView } = require("../viewModels/commentViewModel");
const {findAllUsersByRegExp, findAllSubmissionsByRegExp, findAllCommentsByRegExp} 
= require('../utils/searchService');

/**
 * Handle search by users, submissions(all type) and comments.
 *
 * @param {Object} req - reques object Express.
 * @param {Object} res - response object Express.
 * @returns {void}
 */
exports.searchAll = async (req, res) => {
  const { q } = req.query;

  // Checks q parameter 
  if (!q || typeof q !== "string") {
    return res
      .status(400)
      .json({ error: 'Query parameter "q" is required and must be a string.' });
  }

  // Creating Regular expression without case sensitivity
  const re = new RegExp(q.trim(), "i");

  
  const users = await findAllUsersByRegExp(re);
  const usersView = users.map((u) => ({
    type: "user",
    data: userToView(u),
  }));

  
  const submissions = await findAllSubmissionsByRegExp(re);
  const submissionsView = submissions.map((s) => ({
    type: "submission",
    data: submissionToView(s),
  }));

  
  const comments = await findAllCommentsByRegExp(re);
  const commentsView = comments.map((c) => ({
    type: "comment",
    data: commentToView(c),
  }));

  // resulting
  const result = [...usersView, ...submissionsView, ...commentsView];

  res.status(200).json(result);
};
