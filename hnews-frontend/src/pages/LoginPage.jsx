// src/pages/LoginRegisterPage.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Компонент формы логина/регистрации (принимает onSubmit и флаг isLogin)
import AuthForm from '../components/AuthForm';

// Контекст аутентификации с функциями login и logout
import { AuthContext } from '../context/AuthContext';

// Сервис регистрации: делает POST /api/auth/register
import { registerUser } from '../services/authService';

export default function LoginRegisterPage() {
  // true — показываем форму логина, false — регистрацию
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Получаем функцию login из контекста
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  /**
   * Обработчик отправки формы логина.
   * onSubmit из AuthForm передаёт { username, password }.
   */
  const handleLogin = async ({ username, password }) => {
    // Вызываем login из контекста
    const { success, message } = await login(username, password);

    if (success) {
      // Если всё ок — переадресуем на главную
      navigate('/');
    } else {
      // Иначе показываем ошибку
      alert(message);
    }
  };

  /**
   * Обработчик отправки формы регистрации.
   * Сервис registerUser вернёт { message, error }.
   */
  const handleRegister = async ({ username, password }) => {
    try {
      const { message, error } = await registerUser({ username, password });

      if (message) {
        alert('Регистрация успешна! Теперь войдите.');
        // После успеха переключаемся на таб логина
        setIsLoginTab(true);
      } else {
        throw new Error(error || 'Ошибка регистрации');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Таббар для переключения между «Login» и «Register» */}
      <div style={styles.tabBar}>
        <button
          onClick={() => setIsLoginTab(true)}
          style={isLoginTab ? styles.activeTab : styles.tab}
        >
          Login
        </button>
        <button
          onClick={() => setIsLoginTab(false)}
          style={!isLoginTab ? styles.activeTab : styles.tab}
        >
          Register
        </button>
      </div>

      {/* Собственно сама форма, динамически меняется */}
      <div style={styles.formContainer}>
        {isLoginTab ? (
          // Форма логина: передаём свою функцию handleLogin и isLogin=true
          <AuthForm onSubmit={handleLogin} isLogin={true} />
        ) : (
          // Форма регистрации: передаём handleRegister и isLogin=false
          <AuthForm onSubmit={handleRegister} isLogin={false} />
        )}
      </div>
    </div>
  );
}

// Простые inline-стили для демонстрации
const styles = {
  container: {
    maxWidth: 400,
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  tabBar: {
    display: 'flex',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 8,
    cursor: 'pointer',
    background: '#f0f0f0',
    border: '1px solid #ddd',
    outline: 'none',
  },
  activeTab: {
    flex: 1,
    padding: 8,
    cursor: 'pointer',
    background: '#fff',
    border: '2px solid #0077cc',
    borderBottom: 'none',
    fontWeight: 'bold',
    outline: 'none',
  },
  formContainer: {
    padding: 16,
    border: '1px solid #0077cc',
    borderRadius: '0 0 4px 4px',
    backgroundColor: '#fafafa',
  },
};
