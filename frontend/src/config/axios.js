import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Log API URL on startup for debugging
console.log(`[API] Using backend URL: ${API_BASE_URL}`);
console.log(`[API] Running in ${import.meta.env.MODE} mode`);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
      toast.error(`Connection failed. Backend URL: ${API_BASE_URL}`);
      return Promise.reject(new Error('Network error - Please check your connection'));
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
