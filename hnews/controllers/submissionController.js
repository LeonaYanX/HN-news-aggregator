const Submission = require('../models/Submission');
const User = require('../models/User');
const {userToView} = require('../viewModels/userViewModel');
const { submissionToView } = require('../utils/submissionToView');
const{createNewSubmission, findSubmissionBySpecific, findSubmissionById
  ,addToSubmissionVotesArray, unvoteSubmission, findSubmissionfromCreatedAt }
=require('../utils/submissionService');
const {findUserById} = require('../utils/UserService');
// Create a new submission
exports.createStory = async (req, res) => {
  const { title, url, text, specific } = req.body;

  try {
    if(!specific){
      specific='story';
    }
    const submission = await createNewSubmission(req.user.id,title, url, text, specific); 
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

    const submissions = await findSubmissionBySpecific(filter);

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
    const submission = await findSubmissionById(submissionId);

    if (submission.votes.includes(req.user.id)) {
      return res.status(400).json({ error: 'You have already voted' });
    }

   await addToSubmissionVotesArray(req.user.id);

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
    
    const submission = await findSubmissionById(submissionId);
       await unvoteSubmission(submission, req.user.id);

    res.status(200).json({ message: 'Vote removed successfully' });
  } catch (err) {
    console.error('Error unvoting submission:', err);
    res.status(500).json({ error: 'Failed to remove vote' });
  }
};

// Get submission owner info
exports.getSubmissionOwner = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await findSubmissionById(submissionId);
    const user = await findUserById(submission.by);

    const ownerView = userToView(user);
    res.status(200).json(ownerView);
  } catch (error) {
    console.error('Error getting submission owner:', error);
    res.status(500).json({ message: 'Failed to get submission owner' });
  }
};


// Get submissions from the past day
exports.getSubmissionsByDay = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const submissions = await findSubmissionfromCreatedAt(yesterday);

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

    const submissions = await findSubmissionfromCreatedAt(lastMonth);

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

    const submissions = await findSubmissionfromCreatedAt(lastYear)

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting year submissions:', err);
    res.status(500).json({ message: 'Failed to get year submissions' });
  }
};
