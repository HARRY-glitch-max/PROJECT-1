import axios from 'axios';

/**
 * Axios instance for all API requests
 * Vite's proxy will forward requests starting with "/api" to http://localhost:5000/api
 */
const apiClient = axios.create({
  baseURL: '/api',
  // ❌ Remove the default Content-Type
});

/**
 * Request Interceptor
 * Attaches Authorization header if user is logged in
 */
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('jobConnectUser'));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Logs user out if 401 Unauthorized
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobConnectUser');
      // Optional: redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;