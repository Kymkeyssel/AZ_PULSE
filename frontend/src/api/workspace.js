import apiClient from './client';

export const analyzeProject = async (projectId, question) => {
  const response = await apiClient.post(`/projects/${projectId}/ai-analysis`, { question });
  return response.data;
};
