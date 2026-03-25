import axios from "axios";

// ✅ Use relative path to trigger Vite Proxy bridge
const API = axios.create({
  baseURL: "/api",
});

// ✅ Attach token automatically if present
API.interceptors.request.use((config) => {
  const userData = localStorage.getItem("jobConnectUser");
  if (userData) {
    const user = JSON.parse(userData);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// =======================
// Auth Endpoints
// =======================

// Jobseeker login
export const loginJobseeker = (data) => API.post("/jobseekers/login", data);

// Employer login
export const loginEmployer = (data) => API.post("/employers/login", data);

// Admin login
export const loginAdmin = (data) => API.post("/admin/login", data);

// =======================
// Registration Endpoints
// =======================

export const registerJobseeker = (data) => API.post("/jobseekers/register", data);
export const registerEmployer = (data) => API.post("/employers/register", data);
export const registerAdmin = (data) => API.post("/admin/register", data);

// =======================
// Profile Endpoints
// =======================

export const getJobseekerProfile = () => API.get("/jobseekers/profile/me");
export const updateJobseekerProfile = (data) => API.put("/jobseekers/profile/me", data);

export const getEmployerProfile = () => API.get("/employers/profile/me");
export const updateEmployerProfile = (data) => API.put("/employers/profile/me", data);

export const getAdminProfile = () => API.get("/admin/profile/me");
export const updateAdminProfile = (data) => API.put("/admin/profile/me", data);

// =======================
// Jobseeker Management Endpoints
// =======================

export const getJobseekers = () => API.get("/jobseekers"); // get all
export const getJobseekerById = (id) => API.get(`/jobseekers/${id}`);
export const updateJobseekerById = (id, data) => API.put(`/jobseekers/${id}`, data);
export const deleteJobseekerById = (id) => API.delete(`/jobseekers/${id}`);
export const notifyJobseekerById = (id, data) => API.post(`/jobseekers/${id}/notify`, data);

// =======================
// Employer Management Endpoints
// =======================

export const getEmployers = () => API.get("/employers");
export const getEmployerById = (id) => API.get(`/employers/${id}`);
export const updateEmployerById = (id, data) => API.put(`/employers/${id}`, data);
export const deleteEmployerById = (id) => API.delete(`/employers/${id}`);

// =======================
// Admin Reports
// =======================

export const getAdminReports = () => API.get("/admin/reports");

// =======================
// Job Endpoints
// =======================
export const getJobs = (params) => API.get("/jobs", { params });
export const getJobById = (jobId) => API.get(`/jobs/${jobId}`);
export const applyToJob = (jobId, data) => API.post(`/jobs/${jobId}/apply`, data);
export const createJob = (data) => API.post("/jobs", data);
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
export const deleteMessage = (chatId, messageId) =>
  API.delete(`/chats/${chatId}/messages/${messageId}`);

// =======================
// Interview Endpoints
// =======================
export const scheduleInterview = (jobId, data) => API.post(`/jobs/${jobId}/interviews`, data);
export const getInterviews = () => API.get("/interviews");
export const cancelInterview = (interviewId) => API.delete(`/interviews/${interviewId}`);
export const getEmployerInterviews = () => API.get("/employers/interviews");

export default API;
