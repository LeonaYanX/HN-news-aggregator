import React, { useState, useEffect } from 'react';
import { fetchJobSubmissions } from '../services/submissionService';

export default function NewPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError] = useState(null);

  useEffect(() => {
    fetchJobSubmissions()
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Не удалось загрузить job истории');
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


