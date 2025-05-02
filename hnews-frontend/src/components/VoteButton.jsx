import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { voteSubmission, unvoteSubmission, getSubmissionVoteStatus } from '../services/submissionService';

/**
 * VoteButton — универсальная кнопка-треугольник для голосования/снятия голосования.
 *
 * Props:
 *   - targetId: ID объекта (submission/comment/user)
 *   - initialVoted: boolean — был ли уже голос на момент инициализации
 */
export default function VoteButton({ targetId, initialVoted }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  // При монтировании проверяем реальный статус голосования с сервера
  useEffect(() => {
    if (!auth.accessToken) return;
    getSubmissionVoteStatus(targetId)
      .then(res => setVoted(res.voted))
      .catch(console.error);
  }, [auth.accessToken, targetId]);

  const handleClick = async () => {
    if (!auth.accessToken) {
      // если не авторизован — на страницу /login
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      if (voted) {
        await unvoteSubmission(targetId);
        setVoted(false);
      } else {
        await voteSubmission(targetId);
        setVoted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: voted ? 'orange' : 'gray',
        fontSize: '0.8rem',
        padding: 0,
        marginLeft: '0.25rem',
      }}
      title={voted ? 'Unvote' : 'Vote'}
    >
      ▲
    </button>
  );
}
