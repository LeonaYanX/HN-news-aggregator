// src/pages/AskPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { fetchAskSubmissions } from '../services/submissionService';
import UserVoteButton from '../components/UserVoteButton';
import {
  getUserVoteStatus,
  voteUser,
  unvoteUser
} from '../services/userService';

export default function AskPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем ask-публикации
  useEffect(() => {
    fetchAskSubmissions()
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Не удалось загрузить ask истории');
        setLoading(false);
      });
  }, []);

  // Функция для получения статуса голосования за пользователя (useCallback для оптимизации)
  const fetchVoteStatus = useCallback(
    (userId) => getUserVoteStatus(userId),
    []
  );

  if (loading) return <p>Загрузка...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul>
      {stories.map(s => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.title}
          </a>
          <small>
            by {s.by}{' '}
            {/* Передаём корректный userId для голосования */}
            <UserVoteButton
              userId={s.byId}
              fetchStatusFn={fetchVoteStatus}
              onVote={voteUser}
              onUnvote={unvoteUser}
            />
            {' '}— {s.votesCount} votes
          </small>
        </li>
      ))}
    </ul>
  );
}
