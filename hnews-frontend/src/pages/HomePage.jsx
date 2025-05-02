// src/pages/HomePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { fetchStories } from '../services/submissionService';
import UserVoteButton from '../components/UserVoteButton';
import {
  getUserVoteStatus,
  voteUser,
  unvoteUser
} from '../services/userService';

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
        setError('Error loading stories');
        setLoading(false);
      });
  }, []);

  // Function that gets status of voting for user (useCallback for optimization)
      const fetchVoteStatus = useCallback(
        (userId) => getUserVoteStatus(userId),
        []
      );

  if (loading) return <p>Загрузка...</p>;
  if (error)   return <p style={{ color:'red' }}>{error}</p>;

  return (
    <ul>
      {stories.map(s => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.title}
          </a>
          <small> by {s.by} — {' '}
                       {/* correct userId for votting*/}
                                  <UserVoteButton
                                    userId={s.byId}
                                    fetchStatusFn={fetchVoteStatus}
                                    onVote={voteUser}
                                    onUnvote={unvoteUser}
                                  />
                     {' '} {s.votesCount} votes
            </small>
        </li>
      ))}
    </ul>
  );
}
