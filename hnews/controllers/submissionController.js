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

// Get list of story-type submissions (latest first)
exports.getStories = async (req, res) => {
  try {
    //  finding type- "story" submissions, sorting from new to old
    const submissions = await Submission.find({ specific: 'story' })
      .sort({ createdAt: -1 })
      .populate('by', 'username') 
      .lean(); // creating usual JS objects (not Mongoose documents)

    // giving each submission new fields
    const enhancedSubmissions = submissions.map(sub => ({
      ...sub, // taking all fields
      votesCount: sub.votes ? sub.votes.length : 0, // counting votes
      commentsCount: sub.comments ? sub.comments.length : 0, //counting comments
      createdAt: sub.createdAt, // data already exists 
    }));

    // sending to front
    res.status(200).json(enhancedSubmissions);
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

// get past submissions
exports.getPastSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({specific: 'story'})
    .sort({ createdAt: 1 })
    .populate('by', 'username')
    .lean();
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting past submissions', err);
    res.status(500).json({ message: 'Failed to get past submissions' });
  }
};

// get new submissions
exports.getNewSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({specific: ''})
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting new submissions', err);
    res.status(500).json({ message: 'Failed to get new submissions' });
  }
};

// get specific ask submissions
exports.getAskSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ specific: 'ask' })
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting ask submissions', err);
    res.status(500).json({ message: 'Failed to get ask submissions' });
  }
};

// get specific "show" submissions 
exports.getShowSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ specific: 'show' })
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting show submissions', err);
    res.status(500).json({ message: 'Failed to get show submissions' });
  }
};

// get specific "job" submissions 
exports.getJobSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ specific: 'job' })
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting job submissions', err);
    res.status(500).json({ message: 'Failed to get job submissions' });
  }
};

// Getting the full info about the owner of a submission
exports.getSubmissionOwner = async (req, res) => {
  try {
    const { submissionId } = req.params;

    //Finding the submission and pull basic user info
    const submission = await Submission.findById(submissionId)
      .populate('by', 'username karma createdAt about') // basic author info
      .lean();

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const userId = submission.by._id;

    //Finding the user and populate their related data
    const user = await User.findById(userId)
      .populate({
        path: 'submissions',
        select: 'title createdAt votes comments', // we need votes and comments to count
        populate: { path: 'by', select: 'username' }, // populate submission's author
      })
      .populate({
        path: 'comments',
        select: 'text createdAt parent onSubmission', // for comments: parent, onSubmission
        populate: [
          { path: 'userId', select: 'username' }, // who wrote the comment
          { path: 'parent', select: 'text' }, // parent comment (if exists)
          { path: 'onSubmission', select: 'title' }, // submission where the comment was made
        ],
      })
      .populate({
        path: 'favoriteSubmissions',
        select: 'title createdAt votes comments',
        populate: { path: 'by', select: 'username' },
      })
      .populate({
        path: 'favoriteComments',
        select: 'text createdAt parent onSubmission',
        populate: [
          { path: 'userId', select: 'username' },
          { path: 'parent', select: 'text' },
          { path: 'onSubmission', select: 'title' },
        ],
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Preparing enriched arrays with counts
    const submissions = user.submissions.map(sub => ({
      _id: sub._id,
      title: sub.title,
      createdAt: sub.createdAt,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentCount: sub.comments ? sub.comments.length : 0,
      by: sub.by?.username || 'Unknown',
    }));

    const favoriteSubmissions = user.favoriteSubmissions.map(sub => ({
      _id: sub._id,
      title: sub.title,
      createdAt: sub.createdAt,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentCount: sub.comments ? sub.comments.length : 0,
      by: sub.by?.username || 'Unknown',
    }));

    const comments = user.comments.map(comm => ({
      _id: comm._id,
      text: comm.text,
      createdAt: comm.createdAt,
      parent: comm.parent ? { _id: comm.parent._id, text: comm.parent.text } : null,
      onSubmission: comm.onSubmission ? { _id: comm.onSubmission._id, title: comm.onSubmission.title } : null,
      by: comm.userId ?.username || 'Unknown',
    }));

    const favoriteComments = user.favoriteComments.map(comm => ({
      _id: comm._id,
      text: comm.text,
      createdAt: comm.createdAt,
      parent: comm.parent ? { _id: comm.parent._id, text: comm.parent.text } : null,
      onSubmission: comm.onSubmission ? { _id: comm.onSubmission._id, title: comm.onSubmission.title } : null,
      by: comm.userId?.username || 'Unknown',
    }));

    
    res.status(200).json({
      username: user.username,
      createdAt: user.createdAt,
      karma: user.karma,
      about: user.about,
      submissions,
      comments,
      favoriteSubmissions,
      favoriteComments,
    });

  } catch (err) {
    console.error('Error getting submission owner', err);
    res.status(500).json({ message: 'Failed to get submission owner' });
  }
};

// Getting backday submissions
exports.getSubmissionsByDay = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const submissions = await Submission.find({ createdAt: { $gte: yesterday } })
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting day submissions', err);
    res.status(500).json({ message: 'Failed to get day submissions' });
  }
};

// getting backmonth submissions
exports.getSubmissionsByMonth = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const submissions = await Submission.find({ createdAt: { $gte: lastMonth } })
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting month submissions', err);
    res.status(500).json({ message: 'Failed to get month submissions' });
  }
};

// Getting backyear submissions
exports.getSubmissionsByYear = async (req, res) => {
  try {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const submissions = await Submission.find({ createdAt: { $gte: lastYear } })
    .sort({ createdAt: -1 }).populate('by','username').lean(); 
    const enhancedSubmissions = submissions.map(sub =>({
      ...sub,
      votesCount: sub.votes ? sub.votes.length : 0,
      commentsCount: sub.comments ? sub.comments.length : 0,
      createdAt: sub.createdAt
    }));
    res.status(200).json(enhancedSubmissions);
  } catch (err) {
    console.error('Error getting year submissions', err);
    res.status(500).json({ message: 'Failed to get year submissions' });
  }
};

