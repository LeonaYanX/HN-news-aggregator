const Submission = require('../models/Submission');
const User = require('../models/User');
const {submissionToView}= require('../viewModels/submissionViewModel');

async function updateSubmissionCommentsArrayPush(submission, comment) {
    try {
        if(!submission){
            throw {status: 400 , message: 'Submission is required.'};
        }

        await Submission.findByIdAndUpdate(submission._id, { $push: { comments: comment._id }});

        return true;
    } catch (error) {
        throw error;
    }
   
    
}

async function findSubmissionById(submissionId) {
    try{
        if(!submissionId){
            throw {status: 400, message:'Submission id required'};
        }
        const submission=await Submission.findById(submissionId);
            if(!submission){
                throw {status: 404 , message: 'Submission not found'};
                }

        return submission;

    }catch(err){

        throw err;
    }
    
};

async function deleteSubmissionById(submissionId) {
    try{

        if(!submissionId){
            throw {status:400 , message: 'Submission id required.'};
        }
        const submission = await Submission.findByIdAndDelete(submissionId);
        if(!submission){
            throw {status: 404, message: 'Submission not found'};
        }
        
        return true;

    }catch(err){
        throw err;
    }
    
};
//Creating new submission
async function createNewSubmission(userId, title, url, text, specific='story') {
    try {
        if(!userId || !title || !url || !text){
            throw {status:400 , message: 'Not all params'};
        }
        const submission = new Submission({
              by: userId,
              title,
              url,
              text,
              specific: specific
            });
        
            await submission.save();
            await User.findByIdAndUpdate(userId, { $push: { submissions: submission._id } });
    } catch (error) {
        throw error;
    }
};
//finding submission by specific
async function findSubmissionBySpecific(specificValue) {
    try {
        if(!specificValue){
            throw {status: 400 , message: 'Specific value required.'};
        }
         const submissions = await Submission.find(specificValue)
              .sort({ createdAt: sortOrder })
              .populate('by', 'username')
              .lean();

              return submissions;
    } catch (error) {
        throw error;
    }
};

//Vote adding to submission votes Array(userId)
async function addToSubmissionVotesArray(userId, submission) {
    try {
        if(!userId || !submission){
            throw {status:400, message:'User id and submission both required.'};
        }
        submission.votes.push(userId);
        await submission.save();

        return true;

    } catch (error) {
        throw error;
    }
};
//unvote submission
async function unvoteSubmission(submission, userId) {
    try {
        if(!submission || !userId){
            throw {status:400, message:'Both submission and userId required.'};
        }
        const voteIndex = submission.votes.indexOf(userId);
        if (voteIndex === -1) {
          throw { status:400,  message: 'You have not voted for this submission' };
        }
    
        submission.votes.splice(voteIndex, 1);
        await submission.save();

        return true;

    } catch (error) {
        throw error;
    }
};
//find subs from date past ones
async function findSubmissionfromCreatedAt(date) {
  try {
    if(!date){
        throw {status:400, message:'Date is required.'};
    }
      const submissions = await Submission.find({ createdAt: { $gte: date } })
          .sort({ createdAt: -1 })
          .populate('by', 'username')
          .lean();

          return submissions;

  } catch (error) {
    throw error;
  }  
};



module.exports= {findSubmissionById, deleteSubmissionById, updateSubmissionCommentsArrayPush
    ,createNewSubmission, findSubmissionBySpecific, addToSubmissionVotesArray
    ,unvoteSubmission, findSubmissionfromCreatedAt  };