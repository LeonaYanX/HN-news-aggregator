const {userToView} = require('../viewModels/userViewModel');
const { submissionToView } = require('../viewModels/submissionViewModel');
const{createNewSubmission, findSubmissionBySpecific, findSubmissionById
  ,addToSubmissionVotesArray, unvoteSubmissionUtil, findSubmissionfromCreatedAt }
=require('../utils/submissionService');
const {findUserById} = require('../utils/UserService');

// Create a new submission
exports.createStory = async (req, res) => {
  const { title, url, text, specific } = req.body;


    if(!specific){
      specific='story';
    }
    const submission = await createNewSubmission(req.user.id,title, url, text, specific); 
    res.status(201).json(submissionToView(submission));
};

// Helper to get submissions by specific type
async function getSubmissionsBySpecific(res, specificValue, sortOrder = -1) {

    const filter = specificValue !== undefined ? { specific: specificValue } : {};

    const submissions = await findSubmissionBySpecific(filter);

    const formatted = submissions.map(submissionToView);
    res.status(200).json(formatted);
};

// List of stories (latest first - new)
exports.getStories = async (req, res) => getSubmissionsBySpecific(res, 'story');

// Get past stories (oldest first - past)
exports.getPastSubmissions = async (req, res) => getSubmissionsBySpecific(res, 'story', 1);

// Specific "ask" submissions
exports.getAskSubmissions = async (req, res) => getSubmissionsBySpecific(res, 'ask');

// Specific "show" submissions
exports.getShowSubmissions = async (req, res) => getSubmissionsBySpecific(res, 'show');

// Specific "job" submissions
exports.getJobSubmissions = async (req, res) => getSubmissionsBySpecific(res, 'job');

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
