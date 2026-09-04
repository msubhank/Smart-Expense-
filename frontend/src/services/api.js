import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Pre-configured Axios client.
 * Automatically attaches the current user's Firebase ID token
 * to the Authorization header of every outgoing HTTP request.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Inject Firebase JWT Bearer Token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error('Failed to attach Firebase ID Token to request:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         console.warn('Backend rejected request: Unauthorized (401). Valid Firebase token required.');
//       }
//     } else if (error.request) {
//       console.warn('Backend server is unreachable. Is Spring Boot running on port 8080?');
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
