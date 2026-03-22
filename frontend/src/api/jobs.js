import apiClient from './client';

export const getAllJobs = async (search = '') => {
  const { data } = await apiClient.get(`/jobs?search=${search}`);
  return data;
};

export const getJobDetails = async (id) => {
  const { data } = await apiClient.get(`/jobs/${id}`);
  return data;
};