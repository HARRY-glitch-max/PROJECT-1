import axios from "axios";

// Create Axios instance
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  
});

// Attach token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =======================
// Auth Endpoints
// =======================

export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const getProfile = () => API.get("/users/profile");

// =======================
// Job Endpoints
// =======================

export const getJobs = () => API.get("/jobs");
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post("/jobs", data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// =======================
// Application Endpoints
// =======================

export const applyToJob = (jobId, data) => API.post(`/applications/${jobId}`, data);
export const getApplications = () => API.get("/applications");