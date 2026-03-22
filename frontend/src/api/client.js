import axios from 'axios';

const apiClient = axios.create({
  /**
   * ✅ Use a relative path now! 
   * Vite's proxy in vite.config.js will automatically forward 
   * any request starting with "/api" to http://127.0.0.1:5000/api
   */
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token for Jeremiah, Henry, and Employers
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('jobConnectUser'));
    
    if (user?.token) {
      // ✅ Attach the Bearer token to authorize protected routes
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Optional: Response Interceptor 
 * Logs the user out if the token expires (401 Unauthorized)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobConnectUser');
      // window.location.href = '/login'; // Optional: Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;