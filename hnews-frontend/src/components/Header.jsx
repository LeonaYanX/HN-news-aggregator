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

  return (
    <header style={styles.header}>
      {/* Логотип */}
      <Link to="/" style={styles.logo}>
        HackerNews
      </Link>

      {/* Навигация по разделам */}
      <nav style={styles.nav}>
        <NavLink to="/"       style={styles.link} activeStyle={styles.active}>Welcome</NavLink>
        <NavLink to="/new"    style={styles.link} activeStyle={styles.active}>New</NavLink>
        <NavLink to="/threads"style={styles.link} activeStyle={styles.active}>Threads</NavLink>
        <NavLink to="/past"   style={styles.link} activeStyle={styles.active}>Past</NavLink>
        <NavLink to="/comments" style={styles.link} activeStyle={styles.active}>Comments</NavLink>
        <NavLink to="/ask"    style={styles.link} activeStyle={styles.active}>Ask</NavLink>
        <NavLink to="/show"   style={styles.link} activeStyle={styles.active}>Show</NavLink>
        <NavLink to="/jobs"   style={styles.link} activeStyle={styles.active}>Jobs</NavLink>
        <NavLink to="/submit" style={styles.link} activeStyle={styles.active}>Submit</NavLink>
      </nav>

      {/* Правый блок: имя пользователя и кнопка */}
      <div style={styles.userBlock}>
        {auth.user
          ? (
            <>
              <Link to="/profile" style={styles.username}>{auth.user.username}</Link>
              <button onClick={onLogout} style={styles.button}>Logout</button>
            </>
          )
          : (
            <button onClick={() => navigate('/login')} style={styles.button}>
              Login
            </button>
          )
        }
      </div>
    </header>
  );
};

// Простые inline-стили для примера
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
    gap: '1rem',
    flexGrow: 1,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  active: {
    textDecoration: 'underline',
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
