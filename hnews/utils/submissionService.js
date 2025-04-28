const Submission = require('../models/Submission');
const User = require('../models/User');

async function updateSubmissionCommentsArrayPush(submission, comment) {
    
        if(!submission){
            throw {status: 400 , message: 'Submission is required.'};
        }

     await Submission.findByIdAndUpdate(submission._id, { $push: { comments: comment._id }});

        return true;

};

async function findSubmissionById(submissionId) {
        if(!submissionId){
            throw {status: 400, message:'Submission id required'};
        }
        const submission=await Submission.findById(submissionId);
            if(!submission){
                throw {status: 404 , message: 'Submission not found'};
                }

        return submission; 
};

async function deleteSubmissionById(submissionId) {
        if(!submissionId){
            throw {status:400 , message: 'Submission id required.'};
        }
        const submission = await Submission.findByIdAndDelete(submissionId);
        if(!submission){
            throw {status: 404, message: 'Submission not found'};
        }
        
        return true;
};
//Creating new submission
async function createNewSubmission(userId, title, url, text, specific='story') {
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

            return submission;
};
//finding submission by specific
async function findSubmissionBySpecific(specificValue) {

        if(!specificValue){
            throw {status: 400 , message: 'Specific value required.'};
        }
         const submissions = await Submission.find(specificValue)
              .sort({ createdAt: sortOrder })
              .populate('by', 'username')
              .lean();

              return submissions;
};

//Vote adding to submission votes Array(userId)
async function addToSubmissionVotesArray(userId, submission) {

        if(!userId || !submission){
            throw {status:400, message:'User id and submission both required.'};
        }
        submission.votes.push(userId);
        await submission.save();

        return true;
};
//unvote submission
async function unvoteSubmissionUtil(submission, userId) {

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
};
//find subs from date past ones
async function findSubmissionfromCreatedAt(date) {
    if(!date){
        throw {status:400, message:'Date is required.'};
    }
      const submissions = await Submission.find({ createdAt: { $gte: date } })
          .sort({ createdAt: -1 })
          .populate('by', 'username')
          .lean();

          return submissions;
};




module.exports= {findSubmissionById, deleteSubmissionById, updateSubmissionCommentsArrayPush
    ,createNewSubmission, findSubmissionBySpecific, addToSubmissionVotesArray
    ,unvoteSubmissionUtil, findSubmissionfromCreatedAt  };