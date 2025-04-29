import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import CommentsList from '../components/CommentsList';

export default function StoryPage({ submissionId }) {
  const [story, setStory] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await axios.get(`/submission/${submissionId}`);
      setStory(res.data);
    }
    load();
  }, [submissionId]);

  if (!story) return <p>Загрузка...</p>;

  return (
    <div>
      <h2>{story.title}</h2>
      <a href={story.url} target="_blank" rel="noreferrer">{story.url}</a>
      <p>by {story.by}</p>
      {/* output comments */}
      <CommentsList submissionId={submissionId} />
    </div>
  );
}
