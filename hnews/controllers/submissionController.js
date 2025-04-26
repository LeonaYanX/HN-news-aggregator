const Submission = require('../models/Submission');
const User = require('../models/User');

// Create a new submission
exports.createStory = async (req, res) => {
  const { title, url, text, specific } = req.body;

  try {
    // creating new submission
    const submission = new Submission({
      by: req.user.id, // logined user id from token
      title,
      url,
      text,
      specific: specific || 'story' 
    });

   
    await submission.save();

    // Adding id of Submission to user's sub. array
    await User.findByIdAndUpdate(req.user.id, { $push: { submissions: submission._id } });

    res.status(201).json(submission);
  } catch (err) {
    console.error('Error creating submission:', err);
    res.status(500).json({ error: 'Failed to create submission' });
  }
};

// Get list of submissions (latest first)
exports.getStories = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .sort({ createdAt: -1 }) // new ones first
      .populate('by', 'username') // bringing author's name out
      .lean();

    res.status(200).json(submissions);
  } catch (err) {
    console.error('Error getting submissions:', err);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
};

// Vote for a story
exports.voteStory = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // checking if already voted
    if (submission.votes.includes(req.user.id)) {
      return res.status(400).json({ error: 'You have already voted' });
    }

    // adding vote
    submission.votes.push(req.user.id);
    await submission.save();

    res.status(200).json({ message: 'Voted successfully' });
  } catch (err) {
    console.error('Error voting submission:', err);
    res.status(500).json({ error: 'Failed to vote for submission' });
  }
};

// Unvote submission
exports.unvoteSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // checking if user votted
    const voteIndex = submission.votes.indexOf(req.user.id);
    if (voteIndex === -1) {
      return res.status(400).json({ error: 'You have not voted for this submission' });
    }

    // Deleting vote
    submission.votes.splice(voteIndex, 1);
    await submission.save();

    res.status(200).json({ message: 'Vote removed from submission successfully' });
  } catch (err) {
    console.error('Error unvoting submission:', err);
    res.status(500).json({ error: 'Failed to remove vote from submission' });
  }
};

