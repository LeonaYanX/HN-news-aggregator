const Submission = require('../models/Submission');

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

module.exports= {findSubmissionById, deleteSubmissionById};