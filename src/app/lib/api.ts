import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('swiftstock-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
