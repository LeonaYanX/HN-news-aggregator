// src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Загружаем текущие данные пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me');
        setFormData({ username: res.data.username, email: res.data.email, password: '' });
      } catch (err) {
        console.error(err);
        setMessage('Ошибка при загрузке профиля');
      }
    };

    fetchUser();
  }, []);

  // Обработка изменений формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/auth/update', formData);
      setMessage('Профиль обновлён успешно!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setMessage('Ошибка при обновлении');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Редактировать профиль</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Имя" value={formData.username} onChange={handleChange} />
        <br />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="Новый пароль" value={formData.password} onChange={handleChange} />
        <br />
        <button type="submit">Сохранить</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditProfilePage;
