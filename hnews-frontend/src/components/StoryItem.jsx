import React, { useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function StoryItem({ story, onVoteDelta }) {
  const { auth } = useContext(AuthContext);

  const vote = async () => {
    await axios.post(`/submission/${story.id}/vote`, null, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });
    onVoteDelta(story.id, +1);
  };

  const unvote = async () => {
    await axios.post(`/submission/${story.id}/unvote`, null, {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });
    onVoteDelta(story.id, -1);
  };

  return (
    <div style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <button onClick={vote}>▲</button>
      <button onClick={unvote}>▼</button>
      <a href={story.url} target="_blank" rel="noreferrer">{story.title}</a>
      <div>{story.votesCount} votes · by {story.by}</div>
    </div>
  );
}
