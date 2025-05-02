// src/services/userService.js
import axios from '../api/axios';

/**
 * Vote for a user (increments their karma by 1).
 */
export async function voteUser(userId) {
  const res = await axios.put(`/user/${userId}/vote`);
  return res.data; // { message, karma }
}

/**
 * Unvote a user (decrements their karma by 1).
 */
export async function unvoteUser(userId) {
  const res = await axios.put(`/user/${userId}/unvote`);
  return res.data; // { message, karma }
}

/**
 * Get vote status for the authenticated user wrt another user.
 * Returns { voted: boolean }.
 */
export async function getUserVoteStatus(userId) {
  const res = await axios.get(`/user/${userId}/vote-status`);
  return res.data; 
}

/** GET /api/user/:userId/karma */
export async function fetchUserKarma(userId) {
  const res = await axios.get(`/user/${userId}/karma`);
  return res.data.karma;
}
