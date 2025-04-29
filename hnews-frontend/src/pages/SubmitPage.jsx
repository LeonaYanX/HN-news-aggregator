// src/pages/SubmitPage.jsx
import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function SubmitPage() {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '',
    url: '',
    text: '',
    specific: 'story'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // отправляем форму на бэкенд
      await axios.post('/submission', form, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      alert('История опубликована!');
      setForm({ title: '', url: '', text: '', specific: 'story' });
    } catch (err) {
      // подробный лог
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
        alert((err.response.data.error || err.response.data.message) 
              || 'Ошибка публикации. Попробуйте снова.');
      } else {
        console.error('Error:', err);
        alert('Сетевая ошибка. Проверьте подключение.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Submission</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Заголовок:
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Ссылка:
          <input
            type="url"
            name="url"
            placeholder="https://example.com"
            value={form.url}
            onChange={handleChange}
            // делаем url необязательным: required убран
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Текст:
          <textarea
            name="text"
            placeholder="Текст (опционально)"
            value={form.text}
            onChange={handleChange}
            style={styles.textarea}
          />
        </label>
        <label style={styles.label}>
          Тип:
          <select
            name="specific"
            value={form.specific}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="story">story</option>
            <option value="ask">ask</option>
            <option value="show">show</option>
            <option value="job">job</option>
          </select>
        </label>
        <button type="submit" style={styles.button}>Опубликовать</button>
      </form>
    </div>
  );
}


// Inline-стили для компонента
const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  // Форма расположена в столбик с выравниванием элементов по левому краю
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  // Каждый лейбл включает название поля и само поле, расположенные в колонку
  label: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    width: '100%',
    fontSize: '1rem',
  },
  // Стили для текстовых инпутов
  input: {
    padding: '0.5rem',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  // Стили для textarea
  textarea: {
    padding: '0.5rem',
    width: '100%',
    height: '100px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  // Стили для select
  select: {
    padding: '0.5rem',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  // Стили для кнопки
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0077cc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start', // Кнопка выравнивается по левому краю
    fontSize: '1rem',
  },
};
