// src/pages/WelcomePage.jsx

import React, { useEffect, useState } from 'react';

/**
 * WelcomePage — компонента, которая:
 * 1) При монтировании загружает текст из public/welcome.txt
 * 2) Сохраняет его в локальное состояние
 * 3) Рендерит на страницу
 */
export default function WelcomePage() {
  // Локальное состояние для текста
  const [text, setText] = useState('');       // 1. Начальное значение — пустая строка
  const [error, setError] = useState(null);   // 2. Для возможной ошибки при загрузке

  // Эффект: выполнится один раз после первого рендера
  useEffect(() => {
    // 3. Делаем HTTP-запрос к файлу в папке public
    fetch('/welcome.txt')
      .then((res) => {
        if (!res.ok) {
          // 4. Если код ответа не 200, выбрасываем ошибку
          throw new Error(`Ошибка загрузки: ${res.status}`);
        }
        return res.text();  // 5. Читаем тело как текст
      })
      .then((body) => {
        setText(body);      // 6. Сохраняем текст в состояние
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);  // 7. Сохраняем сообщение ошибки
      });
  }, []);  // пустой массив зависимостей — эффект один раз

  // 8. Рендерим либо ошибку, либо загружаемый текст, либо индикатор загрузки
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }
  if (text === '') {
    return <div>Loading welcome text...</div>;
  }
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome</h1>
      <pre style={{
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f9f9f9',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        {text}
      </pre>
    </div>
  );
}
