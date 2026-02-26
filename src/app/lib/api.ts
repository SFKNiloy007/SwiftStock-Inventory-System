import axios from 'axios';

const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://swiftstock-inventory-system.onrender.com/api'
  : 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl,
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
