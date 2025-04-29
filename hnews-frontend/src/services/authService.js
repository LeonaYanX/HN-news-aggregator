// src/services/authService.js

import axios from '../api/axios';

/**
 * Регистрация нового пользователя
 * POST /api/auth/register
 *
 * @param {{ username: string, password: string }} userData
 * @returns {Promise<{ message: string, user?: object, error?: string }>}
 */
export async function registerUser(userData) {
  // axios берёт baseURL из ../api/axios.js
  const response = await axios.post('/auth/register', userData);
  return response.data;
}

/**
 * Логин пользователя
 * POST /api/auth/login
 *
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ ok: boolean, accessToken?: string, user?: object, error?: string }>}
 */
export async function loginUser({ username, password }) {
  const response = await axios.post(
    '/auth/login',
    { username, password },
    {
      // важно отправить Refresh-cookie, если сервер его выставляет
      withCredentials: true,
    }
  );

  // Возвращаем полный объект: ok (HTTP 2xx → true), токен, профиль
  return {
    ok: response.status >= 200 && response.status < 300,
    ...response.data,
  };
}

/**
 * Refresh access-token
 * POST /api/auth/refresh
 *
 * В запросе автоматически пойдёт HttpOnly-куки с Refresh-токеном.
 *
 * @returns {Promise<{ accessToken: string }>}
 */
export async function refreshToken() {
  const response = await axios.post(
    '/auth/refresh',
    {},               // тело пустое
    { withCredentials: true }
  );
  return response.data; // { accessToken }
}

/**
 * Logout
 * POST /api/auth/logout
 *
 * Сервер снимет Refresh-токен, мы удалим access-токен на клиенте.
 */
export async function logoutUser() {
  await axios.post(
    '/auth/logout',
    {},
    { withCredentials: true }
  );
}
