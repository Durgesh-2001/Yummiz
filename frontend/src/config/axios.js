import axios from 'axios';

// Force production URL
const API_BASE_URL = 'https://yummiz.up.railway.app';
console.log('[Axios] Using API URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
});

// Debug request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('[Axios] Making request:', {
      fullUrl,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('[Axios] Request Error:', error);
    return Promise.reject(error);
  }
);

// Debug response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log('[Axios] Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    if (error.response) {
      console.error('[Axios] Response Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('[Axios] No Response:', {
        url: error.config?.url,
        request: error.request
      });
    } else {
      console.error('[Axios] Config Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
