import axios from 'axios';

// Force production URL
const API_BASE_URL = 'https://yummiz.up.railway.app';
console.log('Using API URL:', API_BASE_URL); // Debug log

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Disable credentials for now
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    console.log('Full error details:', error); // Additional debug log
    return Promise.reject(error);
  }
);

export default axiosInstance;
