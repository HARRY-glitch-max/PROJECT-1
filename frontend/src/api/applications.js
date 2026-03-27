import apiClient from "./client";

// --- Submit a new application (Jobseeker) ---
export const submitApplication = async (formData) => {
  // Axios automatically sets 'multipart/form-data' when it sees FormData
  const { data } = await apiClient.post("/applications", formData);
  return data;
};

// --- Get applications for a specific jobseeker ---
export const getMyApplications = async (userId) => {
  const { data } = await apiClient.get(`/applications/user/${userId}`);
  return data;
};

// --- Get applications for jobs owned by an employer ---
export const getEmployerApplications = async (employerId) => {
  const { data } = await apiClient.get(`/applications/employer/${employerId}`);
  return data;
};

// --- Update application status (Employer review: shortlist/reject/etc.) ---
export const updateApplicationStatus = async (applicationId, status) => {
  const { data } = await apiClient.put(`/applications/${applicationId}/status`, {
    status,
  });
  return data;
};

// --- Get applications for a specific job ---
export const getJobApplications = async (jobId) => {
  const { data } = await apiClient.get(`/applications/job/${jobId}`);
  return data;
};

// --- Get a single application by ID ---
export const getApplicationById = async (applicationId) => {
  const { data } = await apiClient.get(`/applications/${applicationId}`);
  return data;
};

// --- Delete an application ---
export const deleteApplication = async (applicationId) => {
  const { data } = await apiClient.delete(`/applications/${applicationId}`);
  return data;
};
