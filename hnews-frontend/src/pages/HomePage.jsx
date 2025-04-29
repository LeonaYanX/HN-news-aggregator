// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { fetchStories } from '../services/submissionService';

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError] = useState(null);

  useEffect(() => {
    fetchStories()
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Не удалось загрузить истории');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error)   return <p style={{ color:'red' }}>{error}</p>;

  return (
    <ul>
      {stories.map(s => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.title}
          </a>
          <small> by {s.by} — {s.votesCount} votes</small>
        </li>
      ))}
    </ul>
  );
}
