import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
console.log('[Axios] Using API URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (!error.response) {
      // Network error
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.reload();
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      default:
        toast.error(data?.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
