import * as api from "../services/api";

// Auth
export const register = api.registerUser;
export const login = api.loginUser;
export const profile = api.getProfile;

// Jobs
export const jobs = {
  list: api.getJobs,
  get: api.getJobById,
  create: api.createJob,
  update: api.updateJob,
  remove: api.deleteJob,
};

// Applications
export const applications = {
  list: api.getApplications,
  apply: api.applyToJob,
  update: api.updateApplication,
  remove: api.deleteApplication,
};

// Interviews
export const interviews = {
  list: api.getInterviews,
  schedule: api.scheduleInterview,
  update: api.updateInterview,
  cancel: api.cancelInterview,
};

// Notifications
export const notifications = {
  list: api.getNotifications,
  markRead: api.markNotificationRead,
};

// Chat
export const chat = {
  list: api.getChats,
  send: api.sendMessage,
  messages: api.getMessages,
};
