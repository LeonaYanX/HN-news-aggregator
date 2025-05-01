// src/services/commentService.js

import axios from '../api/axios';

// Получить все комментарии к конкретному сабмишну
export async function fetchComments(submissionId) {
  const res = await axios.get(`/comments/submission/${submissionId}`);
  return res.data; // ожидаем массив комментов в виде view-моделей
}

// get all comments in the system
export async function fetchAllComments(){
  const res = await axios.get();
  return res.data; 
}

//vote for comment
export async function voteComment(id) {
  const res = await axios.post(`/comment/${id}/vote`);
  return res.data;
}
//unvote comment
export async function unvoteComment(id) {
  const res = await axios.post(`/comment/${id}/unvote`);
  return res.data;
}