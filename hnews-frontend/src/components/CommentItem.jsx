import React from 'react';

export default function CommentItem({ comment, onVote, onUnvote }) {
  // comment: { id, by, createdAt, votesCount, text }
  return (
    <div style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
      <div style={{ fontSize: '0.9rem', color: '#555' }}>
        <strong>{comment.by}</strong> ·{' '}
        {new Date(comment.createdAt).toLocaleString()} · {comment.votesCount} votes
      </div>
      <p>{comment.text}</p>
      <button onClick={() => onVote(comment.id)}>▲</button>
      <button onClick={() => onUnvote(comment.id)}>▼</button>
    </div>
  );
}
