const Submission = require('../models/Submission');
const User = require('../models/User');
const { submissionToView } = require('../utils/submissionToView');

// Create a new submission
exports.createStory = async (req, res) => {
  const { title, url, text, specific } = req.body;

  try {
    const submission = new Submission({
      by: req.user.id,
      title,
      url,
      text,
      specific: specific || 'story',
    });

    await submission.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { submissions: submission._id } });

    res.status(201).json(submissionToView(submission));
  } catch (err) {
    console.error('Error creating submission:', err);
    res.status(500).json({ error: 'Failed to create submission' });
  }
};

// Helper to get submissions by specific type
async function getSubmissionsBySpecific(res, specificValue, sortOrder = -1) {
  try {
    const filter = specificValue !== undefined ? { specific: specificValue } : {};
    const submissions = await Submission.find(filter)
      .sort({ createdAt: sortOrder })
      .populate('by', 'username')
      .lean();

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting submissions:', err);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
}

// List of stories (latest first - new)
exports.getStories = (req, res) => getSubmissionsBySpecific(res, 'story');

// Get past stories (oldest first - past)
exports.getPastSubmissions = (req, res) => getSubmissionsBySpecific(res, 'story', 1);

// Specific "ask" submissions
exports.getAskSubmissions = (req, res) => getSubmissionsBySpecific(res, 'ask');

// Specific "show" submissions
exports.getShowSubmissions = (req, res) => getSubmissionsBySpecific(res, 'show');

// Specific "job" submissions
exports.getJobSubmissions = (req, res) => getSubmissionsBySpecific(res, 'job');

// Vote for a submission
exports.voteStory = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.votes.includes(req.user.id)) {
      return res.status(400).json({ error: 'You have already voted' });
    }

    submission.votes.push(req.user.id);
    await submission.save();

    res.status(200).json({ message: 'Voted successfully' });
  } catch (err) {
    console.error('Error voting submission:', err);
    res.status(500).json({ error: 'Failed to vote for submission' });
  }
};

// Unvote a submission
exports.unvoteSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const voteIndex = submission.votes.indexOf(req.user.id);
    if (voteIndex === -1) {
      return res.status(400).json({ error: 'You have not voted for this submission' });
    }

    submission.votes.splice(voteIndex, 1);
    await submission.save();

    res.status(200).json({ message: 'Vote removed successfully' });
  } catch (err) {
    console.error('Error unvoting submission:', err);
    res.status(500).json({ error: 'Failed to remove vote' });
  }
};

// Get submission owner info
exports.getSubmissionOwner = (req, res) => {
  const { submissionId } = req.params;

  Submission.findById(submissionId).lean()
    .then(submission => {
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      return User.findById(submission.by).lean();
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const ownerView = userToView(user);
      res.status(200).json(ownerView);
    })
    .catch(err => {
      console.error('Error getting submission owner:', err);
      res.status(500).json({ message: 'Failed to get submission owner' });
    });
};

// Get submissions from the past day
exports.getSubmissionsByDay = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const submissions = await Submission.find({ createdAt: { $gte: yesterday } })
      .sort({ createdAt: -1 })
      .populate('by', 'username')
      .lean();

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting day submissions:', err);
    res.status(500).json({ message: 'Failed to get day submissions' });
  }
};

// Get submissions from the past month
exports.getSubmissionsByMonth = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const submissions = await Submission.find({ createdAt: { $gte: lastMonth } })
      .sort({ createdAt: -1 })
      .populate('by', 'username')
      .lean();

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting month submissions:', err);
    res.status(500).json({ message: 'Failed to get month submissions' });
  }
};

// Get submissions from the past year
exports.getSubmissionsByYear = async (req, res) => {
  try {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const submissions = await Submission.find({ createdAt: { $gte: lastYear } })
      .sort({ createdAt: -1 })
      .populate('by', 'username')
      .lean();

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting year submissions:', err);
    res.status(500).json({ message: 'Failed to get year submissions' });
  }
};
