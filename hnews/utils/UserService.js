const User = require('../models/User');

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
  

module.exports = {findUserById, blockingUserByType, unblockUser};