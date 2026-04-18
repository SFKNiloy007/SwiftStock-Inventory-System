import axios from 'axios';

const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://swiftstock-inventory-system.onrender.com/api'
  : 'http://localhost:5000/api';
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedApiBaseUrl = configuredApiBaseUrl
  ? `${configuredApiBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '')}/api`
  : defaultApiBaseUrl;

export const apiClient = axios.create({
  baseURL: normalizedApiBaseUrl,
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
