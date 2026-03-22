import axios from "axios";

// ✅ Use the relative path to trigger the Vite Proxy bridge
// This fixes the "Connection Refused" error by keeping the request on port 5173
const API = axios.create({
  baseURL: "/api", 
});

// ✅ Attach token automatically if present
// NOTE: Ensure your Login.jsx saves the token as "token" in localStorage
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
export const getProfile = () => API.get("/users/profile/me");
// Fixed: updateProfile usually needs an ID or the body for a PUT request
export const updateProfile = (data) => API.put("/users/profile/me", data);

// ✅ Employer Auth Endpoints
export const registerEmployer = (data) => API.post("/employers/register", data);
export const loginEmployer = (data) => API.post("/employers/login", data);
export const getEmployerProfile = () => API.get("/employers/profile/me");
export const updateEmployerProfile = (data) => API.put("/employers/profile/me", data);

// =======================
// Job Endpoints
// =======================
export const getJobs = (params) => API.get("/jobs", { params }); // Added params for search/filter
export const getJobById = (jobId) => API.get(`/jobs/${jobId}`);
export const applyToJob = (jobId, data) => API.post(`/jobs/${jobId}/apply`, data);

// ✅ Employers can post jobs
export const createJob = (data) => API.post("/jobs", data);

// ✅ Employer-specific job endpoints
export const getEmployerJobs = () => API.get("/employers/jobs");
export const getJobApplications = (jobId) =>
  API.get(`/employers/jobs/${jobId}/applications`);
export const shortlistCandidate = (applicationId) =>
  API.put(`/applications/${applicationId}/shortlist`);

// =======================
// Application Endpoints
// =======================
export const getApplications = () => API.get("/applications");
export const getApplicationById = (appId) => API.get(`/applications/${appId}`);
export const withdrawApplication = (appId) => API.delete(`/applications/${appId}`);

// =======================
// Chat Endpoints
// =======================
export const getMessages = (chatId) => API.get(`/chats/${chatId}/messages`);
export const sendMessage = (chatId, data) => API.post(`/chats/${chatId}/messages`, data);
export const deleteMessage = (chatId, messageId) => API.delete(`/chats/${chatId}/messages/${messageId}`);

// =======================
// Interview Endpoints
// =======================
export const scheduleInterview = (jobId, data) => API.post(`/jobs/${jobId}/interviews`, data);
export const getInterviews = () => API.get("/interviews");
export const cancelInterview = (interviewId) => API.delete(`/interviews/${interviewId}`);

// ✅ Employer-specific interview endpoint
export const getEmployerInterviews = () => API.get("/employers/interviews");

export default API;