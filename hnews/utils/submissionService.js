const Submission = require('../models/Submission');

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

//async function findSubmissionById(submissionId) {
  //  try{
    //    if(){}
    //}catch(err){
   //     throw err;
    //}
    
//};

module.exports= {findSubmissionById, deleteSubmissionById, updateSubmissionCommentsArrayPush};