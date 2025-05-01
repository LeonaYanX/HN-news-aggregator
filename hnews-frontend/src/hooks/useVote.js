// src/hooks/useVote.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useVote({ itemId, fetchStatusFn, onVote, onUnvote }) {
  const { auth } = useContext(AuthContext);
  const [voted, setVoted] = useState(false);

  // 1. При монтировании узнаём, голосовал ли текущий пользователь
  useEffect(() => {
    if (!auth.user) return;
    fetchStatusFn(itemId).then(status => {
      setVoted(status);
    });
  }, [auth.user, itemId]);

  // 2. Обработчик клика
  const handleClick = async () => {
    if (!auth.user) {
      // 2.1. если не залогинен — редирект
      window.location.href = '/login';
      return;
    }
    try {
      if (voted) {
        await onUnvote(itemId);
        setVoted(false);
      } else {
        await onVote(itemId);
        setVoted(true);
      }
    } catch (err) {
      console.error('Vote error', err);
    }
  };

  return { voted, handleClick };
}
