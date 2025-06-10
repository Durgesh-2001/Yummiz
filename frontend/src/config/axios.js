import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://yummiz.up.railway.app';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for slower connections
});

// Request interceptor with logging
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Enhanced response error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      toast.error('Network error - Please check if the server is running');
      console.error('[API] Network Error:', error);
      return Promise.reject(new Error('Network error - Server may be down'));
    }

    const { status, data } = error.response;

    // Log detailed errors in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        status,
        data,
        url: error.config?.url,
        method: error.config?.method
      });
    }

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        toast.error('Session expired - Please login again');
        window.location.href = '/';
        break;
      case 403:
        toast.error('Access denied - Insufficient permissions');
        break;
      case 404:
        toast.error('Service not found - Please try again later');
        break;
      case 429:
        toast.error('Too many attempts - Please wait a moment');
        break;
      case 500:
        toast.error('Server error - Our team has been notified');
        break;
      default:
        toast.error(data?.message || 'Something went wrong');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
