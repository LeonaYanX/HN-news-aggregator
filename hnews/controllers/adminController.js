const User = require('../models/User');
const Submission = require('../models/Submission');
const Comment = require('../models/Comment');

//Block user
exports.blockUser = async (req,res)=>{
    const {userId} = req.params;
    const{blockingType} = req.body;  // blockingType 'temporary'(7 days),'permanent' 
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User is not found'});
        }
        user.isBlocked = true;
        if(blockingType==='temporary'){
            const duration = 7*24*60*60*1000 ; // 7 days
            user.blockedUntil = new Date(Date.now()+duration);
        }
        else if(blockingType==='permanent'){
            user.blockedUntil = null; // forever
        }
        else {
            return res.status(400).json({ message: 'Invalid blocking type' });
          }
        await user.save();
        res.status(200).json({ message: 'User blocked'});
    }catch(err){
        console.error('Block user error', err);
        res.status(500).json({error: 'Failed to block user'});
    }
};

//Unblock User
exports.unblockUser = async (req,res) => {
    const {userId} = req.params;
    // will it be better to write not body but req.params to give info by click
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User is not found'});
        }
        user.isBlocked = false;
        user.blockedUntil = null; // and not blocked is null too

        await user.save();

        res.status(200).json({ message: 'User unblocked' });

    }catch(err){
        console.error('Unblock user error', err);
        res.status(500).json({ error: 'Failed to unblock user' });
    }
};
// delete submission
exports.deleteSubmission = async (req, res) => {
    const {submissionId} = req.params;
    try {
        const submission=await Submission.findByIdAndDelete(submissionId);
        if(!submission){
           return res.status(404).json({message: 'Submission not found'});
        }
        res.status(200).json({ message: 'Submission deleted'});
      } catch (err) {
        console.error('Delete submission error', err);
        res.status(500).json({ error: 'Failed to delete submission' });
      }
    };

    //delete comment
    exports.deleteComment = async (req, res) => {
        const { commentId } = req.params;
        try {
          const comment = await Comment.findByIdAndDelete(commentId);
          if(!comment){
            return res.status(404).json({message: 'Comment not found'});
          }
          res.status(200).json({ message: 'Comment deleted' , comment});
        } catch (err) {
            console.error('Delete comment error', err);
          res.status(500).json({ error: 'Failed to delete comment' });
        }
      };

      //get all users list without passwords

      exports.getAllUsers = async (req,res) => {
        try{
            const users = await User.find().select('-password');
            if(!users){
                return res.status(400).json({message: 'Cannot get users list'});
            }
            res.status(200).json({message: 'User list', users});
        }catch(err){
            console.error('Error getting users list', err);
            res.status(500).json({message: 'Error getting users list'});
        }
      };

      //post user by username
      exports.findUserByUsername = async (req, res) => {
        const { username } = req.body;
      
        if (!username) {
          return res.status(400).json({ error: 'Username is required' });
        }
      
        try {
          const user = await User.findOne({ username: username.toLowerCase() })
            .select('-password')
            .populate('submissions comments favoriteSubmissions favoriteComments');
      
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
      
          res.status(200).json({ user });
        } catch (err) {
          console.error('Find user by username error:', err);
          res.status(500).json({ error: 'Server error' });
        }
      };
      


