const User = require('../models/User');

async function addCommentToUserCommentArray(user,comment) {
    
        if(!user || !comment){
            throw {status:400, message: 'Both user and comment is required.'}
        }
        await User.findByIdAndUpdate(user._id, { $push: { comments: comment._id } });

        return true;
}
async function findUserById(userId) {
      if (!userId) {
        throw { status: 400, message: 'User ID is required' };
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        throw { status: 404, message: 'User not found' };
      }
  
      return user;
  };

  async function blockingUserByType(userId, blockingType) {

     
      const user = await findUserById(userId);
  
      user.isBlocked = true;
        if(blockingType==='temporary'){
            const duration = 7*24*60*60*1000 ; // 7 days
            user.blockedUntil = new Date(Date.now()+duration);
        }
        else if(blockingType==='permanent'){
            user.blockedUntil = null; // forever
        }
        else {
            throw { status: 400, message: 'invalid blocking type' };
          }
        
      return true;
  };

  async function unblockUser(userId) {
 
      
      const user = await findUserById(userId);
      user.isBlocked = false;
      user.blockedUntil = null; // and not blocked is null too

      await user.save();

      return true;
  };
//Getting all users without passwords
  async function getAllUsers() {

        const users = await User.find().select('-password');
        if(!users){
            throw {status: 500, message: 'Cannot get users list.'};
        }
        return users;
     
  };
//finding user by username, returns user with submissions, comments, favSubm, favComm
  async function findUserByUsernameAdmin(username) {
 
        if(!username){
            throw {status:400, message: 'Username is required.'};
        }
         const user = await User.findOne({ usernameLC: username.toLowerCase() })
                    .select('-password')
                    .populate('submissions comments favoriteSubmissions favoriteComments');
              
                  if (!user) {
                   throw {status:404, message:'User is not found'};
                  }

                  return user;
    
  };

  // boolean isAnExisting User method returns true if exists

  async function isAnExistingUser(username) {
  
        if(!username){
            throw {status: 400, message: 'Username is required.'};  
        }
        
        //const usernameLC = username.toLowerCase();
        const existingUser = await User.findOne({username:username });
           
        return !!existingUser; // true(if exists) false(if not)
        
    };
    
  

  //Creating a new User with username,  password , role='guest'
  async function createNewUser(username, password, role='guest') {
    
        if(!username || !password){
            throw {status:400, message:'Username, password is required.'}
        }
       const newUser = new User({username, password, role});

        await newUser.save();

        return newUser;

  };

  //find user by username for login
  async function isAnExistingUserByUsername(username) {
   
        if(!username){
            throw {status:400, message: 'Username is required.'};
        }
        
         const user = await User.findOne({username : username});
             
         if(!user){
            return false
         }
         else{
            return user;
         }
  };

  //Checking users password returns true false

  async function isPassMatching(password,user) {
   
        if(!password){
            throw {status:400, message:'Password required.'};
        }

        const isMatch = await user.comparePassword(password);

      return !!isMatch;
        
    
  };
  //update user's about field
  async function updateUserAbout(about, user) {
  
      if(!about || !user){
        throw {status:400, message:'About and user required.'};
      }
      user.about = about;
      await user.save();

      return true;
  
  };
  //Add to favorites
  async function addSubmissionToFavorites(submissionId, userId) {
  
      if(!submissionId || !userId){
        throw {status:400, message:'UserId and submissionId required.'};
      }

      await User.findByIdAndUpdate(userId,
        { $addToSet: { favoriteSubmissions: submissionId } });

      return true;

  };

module.exports = {findUserById, blockingUserByType
    , unblockUser, getAllUsers, findUserByUsername: findUserByUsernameAdmin
    , isAnExistingUser, createNewUser, isAnExistingUserByUsername, isPassMatching
    ,addCommentToUserCommentArray, updateUserAbout, addSubmissionToFavorites};