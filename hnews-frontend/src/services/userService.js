// src/services/userService.js
import axios from '../api/axios';

export async function voteUser(userId) {
  const res = await axios.put(`/user/${userId}/vote`);
  return res.data;
}

/**
 * Unvote a user (decrements their karma by -1).
 * @param {string} userId - The ID of the user to unvote.
 * @returns {Promise<Object>} - The response data from the server.
 */
export async function unvoteUser(userId) {
  const res = await axios.put(`/user/${userId}/unvote`);
  return res.data;
}
/**
 *  GET /api/user/vote-status
 
*/
export async function fetchSubmissionVoteStatus() {
    const res = await axios.get(`/user/vote-status`);
    return res.data.voted;
  }
