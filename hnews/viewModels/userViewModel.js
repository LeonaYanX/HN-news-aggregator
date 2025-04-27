
 function userToView(userDoc) {
    return {
      id: userDoc._id,
      username: userDoc.username,
      createdAt: userDoc.createdAt,
      karma: userDoc.karma, // karma count
    };
  }
  
  module.exports = { userToView };
  