/**
 * Transforms a user document into a view model.
 *
 * @param {Object} userDoc - Mongoose user document.
 * @return {Object} A simplified view model of the user.
 */
function userToView(userDoc) {
  return {
    id: userDoc._id,
    username: userDoc.username,
    createdAt: userDoc.createdAt,
    karma: userDoc.karmaCount, // Karma score of the user
  };
}

module.exports = { userToView };
