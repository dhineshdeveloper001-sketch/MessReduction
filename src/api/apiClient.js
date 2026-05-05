import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
});

// Request interceptor to add the JWT token to headers
apiClient.interceptors.request.use((config) => {
  // Check for both student and staff tokens
  const token = sessionStorage.getItem('token') || 
                sessionStorage.getItem('staffToken') || 
                localStorage.getItem('token');
                
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
    console.warn("Unauthorized! Clearing tokens.");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('staffToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('staffUser');
    // window.location.href = '/'; 
  }
  return Promise.reject(error);
});

export default apiClient;
