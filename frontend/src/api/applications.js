import apiClient from './client';

export const submitApplication = async (formData) => {
  // Axios automatically sets 'multipart/form-data' when it sees FormData
  const { data } = await apiClient.post('/applications', formData);
  return data;
};

export const getMyApplications = async () => {
  const { data } = await apiClient.get('/applications/my-applications');
  return data;
};