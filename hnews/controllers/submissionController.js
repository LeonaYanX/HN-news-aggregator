const {userToView} = require('../viewModels/userViewModel');
const { submissionToView } = require('../viewModels/submissionViewModel');
const{createNewSubmission, findSubmissionBySpecific, findSubmissionById
  ,addToSubmissionVotesArray, unvoteSubmissionUtil, findSubmissionfromCreatedAt }
=require('../utils/submissionService');
const {findUserById} = require('../utils/UserService');

// Create a new submission
exports.createStory = async (req, res) => {
  let { title, url, text, specific } = req.body; // use let
  // if !specific 'story'
  if (!specific) {
    specific = 'story';
  }
  try {
    const submission = await createNewSubmission(req.user.id, title, url, text, specific);
    res.status(201).json(submissionToView(submission));
  } catch (error) {
    console.error('Ошибка создания публикации:', error);
    res.status(500).json({ error: 'Ошибка создания публикации' });
  }
};


// Helper to get submissions by specific type
async function fetchAndFormatSubmissions(filter = {}, sortOrder = -1) {
  const submissions = await findSubmissionBySpecific(filter, sortOrder);
  return submissions.map(submissionToView);
}

// List of stories (latest first - new)
exports.getStories = async (req, res) => {
  try {
    // 1) через чистый helper получаем список
    const stories = await fetchAndFormatSubmissions({ specific: 'story' }, -1);

    // 2) возвращаем клиенту
    return res.status(200).json(stories);
  } catch (err) {
    console.error('Error in getStories:', err);
    return res.status(500).json({ error: 'Failed to get stories' });
  }
};

// Get past stories (oldest first - past)
exports.getPastSubmissions = async (req, res) => {
  try {
    // 1) через чистый helper получаем список
    const stories = await fetchAndFormatSubmissions({ specific: 'story' }, 1);

    // 2) возвращаем клиенту
    return res.status(200).json(stories);
  } catch (err) {
    console.error('Error in getPastSubmissions:', err);
    return res.status(500).json({ error: 'Failed to get stories' });
  }
};
// Specific "ask" submissions
exports.getAskSubmissions = async (req, res) => {
  try {
    // 1) через чистый helper получаем список
    const stories = await fetchAndFormatSubmissions({ specific: 'ask' }, -1);

    // 2) возвращаем клиенту
    return res.status(200).json(stories);
  } catch (err) {
    console.error('Error in getAskSubmissions:', err);
    return res.status(500).json({ error: 'Failed to get stories' });
  }
};

// Specific "show" submissions
exports.getShowSubmissions = async (req, res) => {
  try {
    // 1) через чистый helper получаем список
    const stories = await fetchAndFormatSubmissions({ specific: 'show' }, -1);

    // 2) возвращаем клиенту
    return res.status(200).json(stories);
  } catch (err) {
    console.error('Error in getShowSubmissions:', err);
    return res.status(500).json({ error: 'Failed to get stories' });
  }
};;

// Specific "job" submissions
exports.getJobSubmissions = async (req, res) => {
  try {
    // 1) через чистый helper получаем список
    const stories = await fetchAndFormatSubmissions({ specific: 'job' }, -1);

    // 2) возвращаем клиенту
    return res.status(200).json(stories);
  } catch (err) {
    console.error('Error in getJobSubmissions:', err);
    return res.status(500).json({ error: 'Failed to get stories' });
  }
};;

// Vote for a submission
exports.voteStory = async (req, res) => {
  const { submissionId } = req.params;


    const submission = await findSubmissionById(submissionId);

    if (submission.votes.includes(req.user.id)) {
      return res.status(400).json({ error: 'You have already voted' });
    }

   await addToSubmissionVotesArray(req.user.id, submission);

    res.status(200).json({ message: 'Voted successfully' });
};

// Unvote a submission
exports.unvoteSubmission = async (req, res) => {
  const { submissionId } = req.params;


    
    const submission = await findSubmissionById(submissionId);
       await unvoteSubmissionUtil(submission, req.user.id);

    res.status(200).json({ message: 'Vote removed successfully' });
};

// Get submission owner info
exports.getSubmissionOwner = async (req, res) => {
  const { submissionId } = req.params;


    const submission = await findSubmissionById(submissionId);
    const user = await findUserById(submission.by);

    const ownerView = userToView(user);
    res.status(200).json(ownerView);
};


// Get submissions from the past day
exports.getSubmissionsByDay = async (req, res) => {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const submissions = await findSubmissionfromCreatedAt(yesterday);

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
};

// Get submissions from the past month
exports.getSubmissionsByMonth = async (req, res) => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const submissions = await findSubmissionfromCreatedAt(lastMonth);

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
};

// Get submissions from the past year
exports.getSubmissionsByYear = async (req, res) => {

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const submissions = await findSubmissionfromCreatedAt(lastYear)

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
};
