// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios'; // ваш настроенный axios-инстанс

// 1) Создаём контекст, который будем «прокидывать» по дереву компонентов
export const AuthContext = createContext();

/**
 * 2) Провайдер аутентификации:
 *  - хранит в себе { user, accessToken }
 *  - предоставляет функции login() и logout()
 */
export function AuthProvider({ children }) {
  // 2.1) Состояние аутентификации
  const [auth, setAuth] = useState({
    user: null,         // { id, username, role } после логина
    accessToken: null,  // JWT для доступа к приватным API
  });

  /**
   * 3) При монтировании провайдера:
   *  - если в localStorage есть сохранённые данные — восстанавливаем сессию
   *  - подставляем токен в axios.defaults.headers.common['Authorization']
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      // 3.1) Восстанавливаем axios-заголовок
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      // 3.2) Обновляем локальное состояние
      setAuth({
        accessToken: storedToken,
        user: JSON.parse(storedUser),
      });
    }
  }, []);

  /**
   * 4) Функция логина
   *  - POST /api/auth/login
   *  - сохраняет accessToken в localStorage + axios.defaults
   *  - сохраняет профиль пользователя
   */
  const login = async (username, password) => {
    try {
      // 4.1) Отправляем credentials
      const response = await axios.post('/auth/login', { username, password });

      const { accessToken, user } = response.data;

      // 4.2) Сохраняем в localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // 4.3) Настраиваем axios для всех последующих запросов
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 4.4) Обновляем состояние контекста
      setAuth({ accessToken, user });

      return { success: true };
    } catch (err) {
      // 4.5) Возвращаем ошибку для UI
      return {
        success: false,
        message: err.response?.data?.error || 'Ошибка входа',
      };
    }
  };

  /**
   * 5) Функция логаута
   *  - POST /api/auth/logout (отправит refresh-token в куки автоматически)
   *  - очищает localStorage, состояние и axios.defaults
   */
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch {
      // даже если сервер упал — всё равно чистим клиент
    }
    // 5.1) Очищаем localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // 5.2) Убираем заголовок из axios
    delete axios.defaults.headers.common['Authorization'];

    // 5.3) Сбрасываем состояние
    setAuth({ accessToken: null, user: null });
  };

  // 6) Прокидываем в дочерние компоненты { auth, login, logout }
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
