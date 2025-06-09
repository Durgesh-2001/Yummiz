import axios from 'axios';

// Hardcode the production URL
const API_BASE_URL = 'https://yummiz.up.railway.app';
console.log('API URL:', API_BASE_URL); // Debug log

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Debug request interceptor
axiosInstance.interceptors.request.use(
  config => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Debug response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a status code outside 2xx range
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No Response Error:', error.request);
    } else {
      // Error in request configuration
      console.error('Request Config Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
