const User = require("../models/User");

/**
 * Adds a comment ID to a user's comments array.
 *
 * @param {Object} user - Mongoose user document.
 * @param {Object} comment - Mongoose comment document.
 * @returns {Promise<boolean>}
 */
async function addCommentToUserCommentArray(user, comment) {
  if (!user || !comment) {
    throw { status: 400, message: "Both user and comment are required." };
  }

  await User.findByIdAndUpdate(user._id, {
    $push: { comments: comment._id },
  });

  return true;
}

/**
 * Finds a user by their ID.
 *
 * @param {string} userId - MongoDB user ID.
 * @returns {Promise<Object>} - Mongoose user document.
 */
async function findUserById(userId) {
  if (!userId) {
    throw { status: 400, message: "User ID is required." };
  }

  const user = await User.findById(userId);
  if (!user) {
    throw { status: 404, message: "User not found." };
  }

  return user;
}

/**
 * Blocks a user temporarily (7 days) or permanently.
 *
 * @param {string} userId - User's ID.
 * @param {'temporary'|'permanent'} blockingType - Type of block.
 * @returns {Promise<boolean>}
 */
async function blockingUserByType(userId, blockingType) {
  const user = await findUserById(userId);

  user.isBlocked = true;

  if (blockingType === "temporary") {
    user.blockedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  } else if (blockingType === "permanent") {
    user.blockedUntil = null;
  } else {
    throw { status: 400, message: "Invalid blocking type." };
  }

  await user.save();
  return true;
}

/**
 * Unblocks a user.
 *
 * @param {string} userId - ID of the user to unblock.
 * @returns {Promise<boolean>}
 */
async function unblockUser(userId) {
  const user = await findUserById(userId);
  user.isBlocked = false;
  user.blockedUntil = null;

  await user.save();
  return true;
}

/**
 * Retrieves all users excluding their passwords.
 *
 * @returns {Promise<Array>} - List of users.
 */
async function getAllUsers() {
  const users = await User.find().select("-password");
  if (!users) {
    throw { status: 500, message: "Cannot get users list." };
  }
  return users;
}

/**
 * Finds user by username, includes submissions and comments.
 *
 * @param {string} username - Username to search.
 * @returns {Promise<Object>} - User document.
 */
async function findUserByUsernameAdmin(username) {
  if (!username) {
    throw { status: 400, message: "Username is required." };
  }

  const user = await User.findOne({ usernameLC: username.toLowerCase() })
    .select("-password")
    .populate("submissions comments favoriteSubmissions favoriteComments");

  if (!user) {
    throw { status: 404, message: "User not found." };
  }

  return user;
}

/**
 * Checks if a user exists by username.
 *
 * @param {string} username - Username to check.
 * @returns {Promise<boolean>}
 */
async function isAnExistingUser(username) {
  if (!username) {
    throw { status: 400, message: "Username is required." };
  }

  const existingUser = await User.findOne({ username });
  return !!existingUser;
}

/**
 * Creates a new user.
 *
 * @param {string} username
 * @param {string} password
 * @param {string} [role='guest']
 * @returns {Promise<Object>} - Created user document.
 */
async function createNewUser(username, password, role = "guest") {
  if (!username || !password) {
    throw { status: 400, message: "Username and password are required." };
  }

  const newUser = new User({ username, password, role });
  await newUser.save();
  return newUser;
}

/**
 * Finds a user by username for login purposes.
 *
 * @param {string} username
 * @returns {Promise<Object|false>} - User document or false.
 */
async function isAnExistingUserByUsername(username) {
  if (!username) {
    throw { status: 400, message: "Username is required." };
  }

  const user = await User.findOne({ username });
  return user || false;
}

/**
 * Checks if a password matches the user's hashed password.
 *
 * @param {string} password
 * @param {Object} user - Mongoose user document.
 * @returns {Promise<boolean>}
 */
async function isPassMatching(password, user) {
  if (!password) {
    throw { status: 400, message: "Password is required." };
  }

  return !!(await user.comparePassword(password));
}

/**
 * Updates the 'about' section of a user.
 *
 * @param {string} about - New about text.
 * @param {Object} user - Mongoose user document.
 * @returns {Promise<boolean>}
 */
async function updateUserAbout(about, user) {
  if (!about || !user) {
    throw { status: 400, message: "About and user are required." };
  }

  user.about = about;
  await user.save();
  return true;
}

/**
 * Adds a submission to the user's favorite submissions array.
 *
 * @param {string} submissionId
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
async function addSubmissionToFavorites(submissionId, userId) {
  if (!submissionId || !userId) {
    throw { status: 400, message: "User ID and submission ID are required." };
  }

  await User.findByIdAndUpdate(userId, {
    $addToSet: { favoriteSubmissions: submissionId },
  });

  return true;
}

module.exports = {
  findUserById,
  blockingUserByType,
  unblockUser,
  getAllUsers,
  findUserByUsername: findUserByUsernameAdmin,
  isAnExistingUser,
  createNewUser,
  isAnExistingUserByUsername,
  isPassMatching,
  addCommentToUserCommentArray,
  updateUserAbout,
  addSubmissionToFavorites,
};
