// src/components/UserVoteButton.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  voteUser as apiVoteUser,
  unvoteUser as apiUnvoteUser,
  getUserVoteStatus
} from '../services/userService';

/**
 * Button component: ▲ triangle to vote/unvote a user.
 *
 * Props:
 *   - userId: the target user's ID
 *   - initialVoted: boolean, true if vote was already cast (optional)
 */
export default function UserVoteButton({ userId, initialVoted = false }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [voted, setVoted] = useState(initialVoted);
  const [busy, setBusy] = useState(false);

  // On mount, fetch real status if not provided
  useEffect(() => {
    if (!auth.accessToken) return;
    getUserVoteStatus(userId)
      .then(data => setVoted(data.voted))
      .catch(console.error);
  }, [auth.accessToken, userId]);

  const handleClick = async () => {
    if (!auth.accessToken) {
      navigate('/login');
      return;
    }
    setBusy(true);
    try {
      if (voted) {
        await apiUnvoteUser(userId);
        setVoted(false);
      } else {
        await apiVoteUser(userId);
        setVoted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: voted ? 'orange' : 'gray',
        fontSize: '0.9rem',
        marginLeft: 4
      }}
      title={voted ? 'Unvote user' : 'Vote user'}
    >
      ▲
    </button>
  );
}
