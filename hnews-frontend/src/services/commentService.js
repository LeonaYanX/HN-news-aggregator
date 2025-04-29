// src/services/commentService.js

import axios from '../api/axios';

// Получить все комментарии к конкретному сабмишну
export async function fetchComments(submissionId) {
  const res = await axios.get(`/comments/submission/${submissionId}`);
  return res.data; // ожидаем массив комментов в виде view-моделей
}

export async function fetchAllComments(){
  const res = await axios.get();
  return res.data; 
}
