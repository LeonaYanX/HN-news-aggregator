// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  generateTokens,
  refreshTokens,
  revokeRefreshToken
} = require('../utils/token');
const RefreshTokenModel = require('../models/RefreshToken');

const {
  isAnExistingUser,
  createNewUser,
  isAnExistingUserByUsername,
  isPassMatching,
  findUserById
} = require('../utils/UserService');

const { userToView } = require('../viewModels/userViewModel');
const jwtConfig = require('../config/jwt');

/**
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  const { username, password, role = 'guest' } = req.body;

  // Проверяем, что логин свободен
  if (await isAnExistingUserByUsername(username)) {
    return res.status(400).json({ error: 'Username is already taken.' });
  }

  // Создаём нового пользователя
  const user = await createNewUser(username, password, role);

  // Возвращаем вью-модель без пароля
  return res
    .status(201)
    .json({ message: 'User registered successfully', user: userToView(user) });
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Ищем пользователя по username
  const user = await isAnExistingUserByUsername(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found, please register first.' });
  }

  // Проверяем пароль
  if (!(await isPassMatching(password, user))) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // Проверяем блокировку
  if (user.isBlocked) {
    if (user.blockedUntil && user.blockedUntil > Date.now()) {
      return res.status(403).json({ error: 'User is temporarily blocked.' });
    }
    if (!user.blockedUntil) {
      return res.status(403).json({ error: 'User is permanently blocked.' });
    }
  }

  // Генерируем пару токенов
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Сохраняем refresh в HttpOnly-cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });

  // Отдаём access и профиль
  return res.json({
    accessToken,
    user: userToView(user)
  });
};

/**
 * POST /api/auth/refresh
 */
exports.refreshAccessToken = async (req, res) => {
  // Берём refresh из cookie
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    const { accessToken, refreshToken } = await refreshTokens(oldToken);

    // Перезаписываем cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (oldToken) {
    // Удаляем из БД и сбрасываем cookie
    await revokeRefreshToken(oldToken);
    res.clearCookie('refreshToken');
  }
  return res.json({ message: 'Logged out successfully.' });
};
