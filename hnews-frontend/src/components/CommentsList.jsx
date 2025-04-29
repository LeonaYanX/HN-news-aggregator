import React, { useEffect, useState, useContext } from 'react';
import CommentItem from './CommentItem';
import { fetchComments } from '../services/commentService';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function CommentsList({ submissionId }) {
  const [comments, setComments] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    async function load() {
      const data = await fetchComments(submissionId);
      setComments(data);
    }
    load();
  }, [submissionId]);

  // голосуем за комментарий
  const handleVote = async (commentId) => {
    await axios.post(`/comments/${commentId}/vote`, null, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });
    setComments(comments.map(c =>
      c.id === commentId ? { ...c, votesCount: c.votesCount + 1 } : c
    ));
  };

  // снимаем голос
  const handleUnvote = async (commentId) => {
    await axios.post(`/comments/${commentId}/unvote`, null, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });
    setComments(comments.map(c =>
      c.id === commentId ? { ...c, votesCount: c.votesCount - 1 } : c
    ));
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Комментарии</h3>
      {comments.map(c => (
        <CommentItem
          key={c.id}
          comment={c}
          onVote={handleVote}
          onUnvote={handleUnvote}
        />
      ))}
    </div>
  );
}
