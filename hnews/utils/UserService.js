const User = require('../models/User');
const bcrypt = require('bcrypt');

// Helper: Find user by ID
async function findUserById(userId) {
  if (!userId) throw { status: 400, message: 'User ID is required.' };

  const user = await User.findById(userId);
  if (!user) throw { status: 404, message: 'User not found.' };

  return user;
}

// Block user by type
async function blockingUserByType(userId, blockingType) {
  const user = await findUserById(userId);

  user.isBlocked = true;

  if (blockingType === 'temporary') {
    const duration = 7 * 24 * 60 * 60 * 1000; // 7 days
    user.blockedUntil = new Date(Date.now() + duration);
  } else if (blockingType === 'permanent') {
    user.blockedUntil = null;
  } else {
    throw { status: 400, message: 'Invalid blocking type.' };
  }

  await user.save();
  return true;
}

// Unblock user
async function unblockUser(userId) {
  const user = await findUserById(userId);

  user.isBlocked = false;
  user.blockedUntil = null;

  await user.save();
  return true;
}

// Get all users
async function getAllUsers() {
  const users = await User.find().select('-password');
  if (!users) throw { status: 500, message: 'Failed to get users list.' };

  return users;
}

// Find user by username (Admin)
async function findUserByUsernameAdmin(username) {
  if (!username) throw { status: 400, message: 'Username is required.' };

  const user = await User.findOne({ usernameLC: username.toLowerCase() })
    .select('-password')
    .populate('submissions comments favoriteSubmissions favoriteComments');

  if (!user) throw { status: 404, message: 'User not found.' };

  return user;
}

module.exports = {
  findUserById,
  blockingUserByType,
  unblockUser,
  getAllUsers,
  findUserByUsernameAdmin
};
