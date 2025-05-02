// src/components/UserVoteButton.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  voteSubmission as apiVoteSubmission,
  unvoteSubmission as apiUnvoteSubmission,
  getSubmissionVoteStatus
} from '../services/submissionService';

/**
 * Button component: ▲ triangle to vote/unvote a user.
 *
 * Props:
 *   - userId: the target user's ID
 *   - initialVoted: boolean, true if vote was already cast (optional)
 */
export default function VoteButton({ userId, initialVoted = false }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [voted, setVoted] = useState(initialVoted);
  const [busy, setBusy] = useState(false);

  // On mount, fetch real status if not provided
  useEffect(() => {
    if (!auth.accessToken) return;
    getSubmissionVoteStatus(userId)
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
        await apiUnvoteSubmission(userId);
        setVoted(false);
      } else {
        await apiVoteSubmission(userId);
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
      title={voted ? 'Unvote submission' : 'Vote submission'}
    >
      ▲
    </button>
  );
}
