// src/api.js

const API_URL = import.meta.env.VITE_API_URL; // http://localhost:5000/api

// Helper for POST requests
async function post(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

// Helper for GET requests with optional token
async function get(endpoint, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_URL}${endpoint}`, { headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

// User API functions
export const registerUser = async (userData) => {
  // userData = { name, email, password, role }
  return post("/users/register", userData);
};

export const loginUser = async (credentials) => {
  // credentials = { email, password }
  return post("/users/login", credentials);
};

export const getUserProfile = async (token) => {
  return get("/users/profile", token);
};
