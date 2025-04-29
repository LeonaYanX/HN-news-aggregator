// utils/token.js

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const RefreshToken = require('../models/RefreshToken');

/**
 * Выпускает одиночный JWT по переданному payload.
 * Обычно это access-токен с коротким сроком жизни.
 *
 * @param {object} payload — полезная нагрузка, например { id: userId }
 * @param {string} [expiresIn='1h'] — время жизни токена (ms, s, m, h, d)
 * @returns {string} сгенерированный JWT
 */
function generateToken(payload, expiresIn = jwtConfig.expiresIn) {
  return jwt.sign(payload, jwtConfig.secretKey, { expiresIn });
}

/**
 * Выпускает пару токенов: access + refresh.
 *  - accessToken — короткоживущий (по умолчанию 15 минут)
 *  - refreshToken — долгоживущий (по умолчанию 7 дней)
 * Сохраняет refreshToken в БД для последующего контроля и отзыва.
 *
 * @param {string} userId — _id пользователя из MongoDB
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
async function generateTokens(userId) {
  // 1) Создаём payload для access-токена
  const payload = { id: userId };

  // 2) Генерируем access и refresh
  const accessToken  = generateToken(payload, '15m');
  const refreshToken = jwt.sign({ id: userId }, jwtConfig.secretKey, { expiresIn: '7d' });

  // 3) Сохраняем refresh в БД с датой истечения
  await RefreshToken.create({
    token: refreshToken,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
  });

  return { accessToken, refreshToken };
}

/**
 * Обновляет пару токенов по старому refresh-токену.
 *  - Проверяет наличие и срок годности старого refresh в БД
 *  - Генерирует новую пару
 *  - Удаляет/откатывает старый refresh (по необходимости)
 *
 * @param {string} oldRefreshToken
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 * @throws {Error} если токен не найден или просрочен
 */
async function refreshTokens(oldRefreshToken) {
  // 1) Ищем запись в БД
  const record = await RefreshToken.findOne({ token: oldRefreshToken });
  if (!record) {
    throw new Error('Refresh token not found');
  }

  // 2) Проверяем дату истечения
  if (record.expiresAt < Date.now()) {
    // на будущее: можно удалять старый
    await RefreshToken.deleteOne({ _id: record._id });
    throw new Error('Refresh token expired');
  }

  // 3) Генерируем новую пару
  const { accessToken, refreshToken } = await generateTokens(record.userId);

  // 4) Удаляем старую запись (чтобы не накапливать)
  await RefreshToken.deleteOne({ _id: record._id });

  return { accessToken, refreshToken };
}

/**
 * Явно отзывает (удаляет) refresh-токен из БД.
 * Вызывается при логауте.
 *
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
async function revokeRefreshToken(refreshToken) {
  await RefreshToken.deleteOne({ token: refreshToken });
}

module.exports = {
  generateToken,
  generateTokens,
  refreshTokens,
  revokeRefreshToken
};
