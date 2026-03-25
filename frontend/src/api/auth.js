import apiClient from "./client";

/**
 * UNIFIED LOGIN (Jobseeker, Employer, Admin)
 * Hits router.post("/login", unifiedLogin) in loginRoutes.js
 */
export const login = async (credentials) => {
  try {
    const { data } = await apiClient.post("/auth/login", credentials);
    // Store user data (including token) in localStorage
    if (data.token) {
      localStorage.setItem("jobConnectUser", JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed. Please check your connection.";
  }
};

/**
 * NEW USER REGISTRATION
 * Still handled in userRoutes.js (unless you unify registration later)
 */
export const register = async (userData) => {
  try {
    const { data } = await apiClient.post("/users/register", userData);
    if (data.token) {
      localStorage.setItem("jobConnectUser", JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed.";
  }
};

/**
 * LOGOUT
 */
export const logout = () => {
  localStorage.removeItem("jobConnectUser");
};
