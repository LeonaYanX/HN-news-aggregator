// src/components/Header.jsx
import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  // Общий стиль для всех ссылок
  const baseLinkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
    marginRight: '1rem',
  };

  return (
    <header style={styles.header}>
      {/* Логотип */}
      <Link to="/" style={styles.logo}>
        HackerNews
      </Link>

      {/* Навигация */}
      <nav style={styles.nav}>
        {[
          ['Welcome', '/welcome'],
          ['New', '/new'],
          ['Threads', '/threads'],
          ['Past', '/past'],
          ['Comments', '/comments'],
          ['Ask', '/ask'],
          ['Show', '/show'],
          ['Jobs', '/jobs'],
          ['Submit', '/submit'],
        ].map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            // style — функция, получающая { isActive }
            style={({ isActive }) => ({
              ...baseLinkStyle,
              // если активен, подчёркиваем
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Блок пользователя */}
      <div style={styles.userBlock}>
        {auth.user ? (
          <>
            {/* Ссылка на профиль пользователя */}
            <Link to="/profile" style={styles.username}>
              {auth.user.username}
            </Link>
            {/* Кнопка выхода */}
            <button onClick={onLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/auth')} style={styles.button}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

// Inline-стили
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff6600',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
    marginRight: '2rem',
  },
  nav: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  },
  userBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  username: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  button: {
    background: 'none',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
  },
};

export default Header;
