// src/pages/AskPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { fetchAskSubmissions
} from '../services/submissionService';
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

  //loading ask-submissions
  useEffect(() => {
    fetchAskSubmissions()
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading ask submissions');
        setLoading(false);
      });
  }, []);

  // Function that gets status of voting for user (useCallback for optimization)
  const fetchVoteStatus = useCallback(
    (userId) => getUserVoteStatus(userId),
    []
  );

  if (loading) return <p>loading...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul>
      {stories.map(s => (
        <li key={s.id}>
          {' '}
          <small>
           by {s.by} {' '}
               {' '}
            {/* correct userId for votting */}
            <UserVoteButton
              userId={s.byId}
              fetchStatusFn={fetchVoteStatus}
              onVote={voteUser}
              onUnvote={unvoteUser}
            />
            {' '}
            </small>
            {' '}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title} {' '}
            </a>
        </li>
      ))}
    </ul>
  );
}
