const User = require('../models/User');

async function addCommentToUserCommentArray(user,comment) {
    try {
        if(!user || !comment){
            throw {status:400, message: 'Both user and comment is required.'}
        }
        await User.findByIdAndUpdate(user._id, { $push: { comments: comment._id } });

        return true;

    } catch (error) {
        throw error;
    }
}
async function findUserById(userId) {
    try {
      if (!userId) {
        throw { status: 400, message: 'User ID is required' };
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        throw { status: 404, message: 'User not found' };
      }
  
      return user;

    } catch (error) {
      //trowing error for controller to be able to give a right status
      throw error;
    }
  };

  async function blockingUserByType(userId, blockingType) {
    try {
     
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

    } catch (error) {
      throw error;
    }
  };

  async function unblockUser(userId) {
    try {
      
      const user = await findUserById(userId);
      user.isBlocked = false;
      user.blockedUntil = null; // and not blocked is null too

      await user.save();

      return true;

    } catch (error) {
      
      throw error;
    }
  };
//Getting all users without passwords
  async function getAllUsers() {
    try{
        const users = await User.find().select('-password');
        if(!users){
            throw {status: 500, message: 'Cannot get users list.'};
        }
        return users;

    }catch(err){
        throw err;
    }
     
  };
//finding user by username, returns user with submissions, comments, favSubm, favComm
  async function findUserByUsernameAdmin(username) {
    try{ 
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

    }catch(err){throw err;}
    
  };

  // boolean isAnExisting User method returns true if exists

  async function isAnExistingUser(username, email) {
    try {
        if(!username){
            throw {status: 400, message: 'Username is required.'};  
        }
        else if(!email){
            throw {status: 400, message: 'Email is required.'};   
        }
        const usernameLC = username.toLowerCase();
        const existingUser = await User.findOne({ $or: [{usernameLC:usernameLC}, {email}] });
           
        return !!existingUser; // true(if exists) false(if not)
        
    } catch (error) {
        throw error;
    }
    
  };

  //Creating a new User with username, email, password , role='guest'
  async function createNewUser(username, email, password, role='guest') {
    try {
        if(!username || !email || !password){
            throw {status:400, message:'Username, password and email is required.'}
        }
       const newUser = new User({username, email, password, role});

        await newUser.save();

        return true;

    } catch (error) {
       throw error; 
    }
  };

  //find user by username for login
  async function isAnExistingUserByUsername(username) {
    try {
        if(!username){
            throw {status:400, message: 'Username is required.'};
        }
        const usernameLc = username.toLowerCase();
         const user = await User.findOne({usernameLC : usernameLc});
             
         if(!user){
            return false
         }
         else{
            return user;
         }

    } catch (error) {
        throw error;
    }
  };

  //Checking users password returns true false

  async function isPassMatching(password) {
    try {
        if(!password){
            throw {status:400, message:'Password required.'};
        }

        const isMatch = await user.comparePassword(password);

      return !!isMatch;
        
    } catch (error) {
        throw error;
    }
    
  };
  //update user's about field
  async function updateUserAbout(about, user) {
    try {
      if(!about || !user){
        throw {status:400, message:'About and user required.'};
      }
      user.about = about;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  };
  //Add to favorites
  async function addSubmissionToFavorites(submissionId, userId) {
    try {
      if(!submissionId || !userId){
        throw {status:400, message:'UserId and submissionId required.'};
      }

      await User.findByIdAndUpdate(userId,
        { $addToSet: { favoriteSubmissions: submissionId } });

      return true;

    } catch (error) {
      throw error;
    }
  };

module.exports = {findUserById, blockingUserByType
    , unblockUser, getAllUsers, findUserByUsername: findUserByUsernameAdmin
    , isAnExistingUser, createNewUser, isAnExistingUserByUsername, isPassMatching
    ,addCommentToUserCommentArray, updateUserAbout, addSubmissionToFavorites};