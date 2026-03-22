import apiClient from './client';

export const getMyInterviews = async () => {
  const { data } = await apiClient.get('/interviews/my-interviews');
  return data;
};

export const updateInterviewStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/interviews/${id}`, { status });
  return data;
};