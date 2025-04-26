const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // For nested comments
  onSubmission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  text: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);
