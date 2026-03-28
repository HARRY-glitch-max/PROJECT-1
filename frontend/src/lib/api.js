// src/services/api.js
import axios from "axios";

// Existing exports...
export const registerUser = (data) => axios.post("/api/auth/register", data);
export const loginUser = (data) => axios.post("/api/auth/login", data);
export const getProfile = () => axios.get("/api/auth/profile");

// Jobs
export const getJobs = () => axios.get("/api/jobs");
export const getJobById = (id) => axios.get(`/api/jobs/${id}`);
export const createJob = (data) => axios.post("/api/jobs", data);
export const updateJob = (id, data) => axios.put(`/api/jobs/${id}`, data);
export const deleteJob = (id) => axios.delete(`/api/jobs/${id}`);

// Applications
export const getApplications = () => axios.get("/api/applications");
export const applyToJob = (jobId, data) => axios.post(`/api/applications/${jobId}`, data);
export const updateApplication = (id, data) => axios.put(`/api/applications/${id}`, data);
export const deleteApplication = (id) => axios.delete(`/api/applications/${id}`);

// ✅ NEW: Employer applications
export const getEmployerApplications = (employerId) => {
  return axios.get(`/api/applications/employer/${employerId}`);
};

// Interviews
export const getInterviews = () => axios.get("/api/interviews");
export const scheduleInterview = (jobId, data) => axios.post(`/api/interviews/${jobId}`, data);
export const updateInterview = (id, data) => axios.put(`/api/interviews/${id}`, data);
export const cancelInterview = (id) => axios.delete(`/api/interviews/${id}`);
export const getEmployerInterviews = (employerId) => axios.get(`/api/interviews/employer/${employerId}`);

// Notifications
export const getNotifications = () => axios.get("/api/notifications");
export const markNotificationRead = (id) => axios.put(`/api/notifications/${id}/read`);

// Chat
export const getChats = () => axios.get("/api/chats");
export const sendMessage = (data) => axios.post("/api/chats", data);
export const getMessages = (chatId) => axios.get(`/api/chats/${chatId}/messages`);
