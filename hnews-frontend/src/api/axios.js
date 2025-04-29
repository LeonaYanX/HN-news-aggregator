// src/api/axios.js

import axios from 'axios';

// создаём инстанс с базовым URL
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // чтобы отправлялись HttpOnly-cookie автоматически
});

// интерсептор: ловим 401, делаем refresh и повторяем запрос
instance.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      // вызываем эндпоинт /auth/refresh (refresh-token из cookie)
      const { data } = await instance.post('/auth/refresh');
      // кладём новый access в заголовок
      instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      original.headers['Authorization'] = `Bearer ${data.accessToken}`;
      // повторяем исходный запрос
      return instance(original);
    }
    return Promise.reject(err);
  }
);

export default instance;
