import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Request interceptor to add the JWT token to headers
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Optionally redirect to login or clear storage
    console.warn("Unauthorized! Clearing token.");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    // window.location.href = '/'; 
  }
  return Promise.reject(error);
});

export default apiClient;
