// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { findUserById } = require('../utils/UserService');

/**
 * requireAuth — middleware для защиты приватных роутов.
 *
 * 1) Извлекает JWT из заголовка Authorization
 * 2) Проверяет его подпись и срок годности
 * 3) Подтягивает пользователя из БД (findUserById)
 * 4) Кладёт в req.user ({ id, username, role }) и вызывает next()
 * 5) При любой ошибке — возвращает 401 Unauthorized
 */
async function requireAuth(req, res, next) {
  // 1. Достаём заголовок
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token is required in Authorization header' });
  }

  // 2. Отсекаем префикс 'Bearer ' и обрезаем пробелы
  const token = authHeader.slice(7).trim();

  try {
    // 3. Верифицируем токен: проверяем подпись и exp
    const decoded = jwt.verify(token, jwtConfig.secretKey);

    // 4. Проверяем, что пользователь есть в БД
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 5. Кладём минимальный объект пользователя в req.user
    req.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role
    };

    // 6. Продолжаем цепочку
    next();
  } catch (err) {
    // Если подпись неверна или токен просрочен
    console.error('Authentication error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
