import apiClient from "./client";

/**
 * JEREMIAH (Jobseeker) & EMPLOYER LOGIN
 * This hits your router.post("/login", loginUser) in userRoutes.js
 */
export const login = async (credentials) => {
  try {
    const { data } = await apiClient.post("/users/login", credentials);
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
 * This hits router.post("/register", registerUser)
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
 * HENRY (Admin) LOGIN
 * Hits your router.post("/login", loginAdmin) in adminRoutes.js
 */
export const loginAdmin = async (credentials) => {
  try {
    const { data } = await apiClient.post("/admin/login", credentials);
    if (data.token) {
      localStorage.setItem("jobConnectUser", JSON.stringify(data));
    }
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Admin access denied.";
  }
};

/**
 * LOGOUT
 */
export const logout = () => {
  localStorage.removeItem("jobConnectUser");
};