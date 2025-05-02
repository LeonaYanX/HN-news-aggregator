// src/components/StoryItem.jsx
import React from 'react';
import VoteButton from './VoteButton';
import { useVote } from '../hooks/useVote';
import { voteSubmission, unvoteSubmission } from '../services/submissionService';
import { fetchSubmissionVoteStatus } from '../services/submissionService'; // надо реализовать

export default function SubmissionCard({ submission }) {
  const { id, title, by, votesCount } = submission;

  const { voted, handleClick } = useVote({
    itemId: id,
    fetchStatusFn: fetchSubmissionVoteStatus,
    onVote: voteSubmission,
    onUnvote: unvoteSubmission
  });

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem 0' }}>
      <VoteButton voted={voted} onClick={handleClick} />
      <strong>{votesCount + (voted ? 1 : 0)}</strong>
      {' '}
      <a href={submission.url}>{title}</a>
      <div>by <a href={`/user/${by.id}`}>{by.username}</a></div>
    </div>
  );
}
