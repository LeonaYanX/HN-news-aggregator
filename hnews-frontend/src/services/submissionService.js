// src/services/submissionService.js

import axios from '../api/axios';

/**
 * GET /api/submission
 * Получить все публикации (story-type по умолчанию)
 * @returns {Promise<Array>} — массив вью-моделей {id, title, by, votesCount, createdAt, url}
 */
export async function fetchStories() {
  const response = await axios.get('/submission');
  return response.data;
}

/**
 * POST /api/submission
 * Создать новую публикацию
 * @param {{ title: string, url: string, text?: string, specific?: string }} payload
 * @returns {Promise<Object>} — вью-модель созданной публикации
 */
export async function createSubmission(payload) {
  const response = await axios.post('/submission', payload);
  return response.data;
}

/**
 * POST /api/submission/:id/vote
 * Проголосовать за публикацию
 * @param {string} submissionId
 */
export async function voteSubmission(submissionId) {
  const response = await axios.post(`/submission/${submissionId}/vote`);
  return response.data;
}

/**
 * POST /api/submission/:id/unvote
 * Снять голос с публикации
 * @param {string} submissionId
 */
export async function unvoteSubmission(submissionId) {
  const response = await axios.post(`/submission/${submissionId}/unvote`);
  return response.data;
}

/**
 * GET /api/submission/past
 * Публикации за прошлые дни (от старых к новым)
 */
export async function fetchPastSubmissions() {
  const response = await axios.get('/submission/past');
  return response.data;
}

/**
 * GET /api/submission/new
 * Новые публикации (сортировка по убыванию даты)
 */
export async function fetchNewSubmissions() {
  const response = await axios.get('/submission/new');
  return response.data;
}

/**
 * GET /api/submission/ask
 * Публикации типа "ask"
 */
export async function fetchAskSubmissions() {
  const response = await axios.get('/submission/ask');
  return response.data;
}

/**
 * GET /api/submission/show
 * Публикации типа "show"
 */
export async function fetchShowSubmissions() {
  const response = await axios.get('/submission/show');
  return response.data;
}

/**
 * GET /api/submission/job
 * Публикации типа "job"
 */
export async function fetchJobSubmissions() {
  const response = await axios.get('/submission/job');
  return response.data;
}

/**
 * GET /api/submission/day/back
 * Публикации за последний день
 */
export async function fetchDayBackSubmissions() {
  const response = await axios.get('/submission/day/back');
  return response.data;
}

/**
 * GET /api/submission/month/back
 * Публикации за последний месяц
 */
export async function fetchMonthBackSubmissions() {
  const response = await axios.get('/submission/month/back');
  return response.data;
}

/**
 * GET /api/submission/year/back
 * Публикации за последний год
 */
export async function fetchYearBackSubmissions() {
  const response = await axios.get('/submission/year/back');
  return response.data;
}

/**
 * Get vote status for the authenticated user wrt another user.
 * Returns { voted: boolean }.
 */
export async function getSubmissionVoteStatus(userId) {
  const res = await axios.get(`/user/${userId}/vote-status`);
  return res.data; 
}
