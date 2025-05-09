// src/components/UserVoteButton.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  voteUser as apiVoteUser,
  unvoteUser as apiUnvoteUser,
  getUserVoteStatus, fetchUserKarma
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
  const [karma, setKarma] = useState(0);

  // On mount, fetch real status if not provided
  useEffect(() => {
    if (!userId) return;
    // Initial fetch of vote status and karma count
    Promise.all([
      getUserVoteStatus(userId),
      fetchUserKarma(userId)
    ]).then(([{ voted }, karmaCount]) => {
      setVoted(voted);
      setKarma(karmaCount);
    }).catch(console.error);
  }, [userId, auth.accessToken]);

  const handleClick = async () => {
    if (!auth.accessToken) {
      navigate('/login');
      return;
    }
    setBusy(true);
    try {
      if (voted) {
        const { karma: newKarma } = await apiUnvoteUser(userId);
        setKarma(newKarma);
        setVoted(false);
      } else {
        const { karma: newKarma } = await apiVoteUser(userId);
        setKarma(newKarma);
        setVoted(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Vote failed');
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
      ▲ <span style={{ marginLeft: 4 }}>{'Karma '}{karma}</span>
    </button>
  );
}
