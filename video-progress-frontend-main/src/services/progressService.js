import api from './api';

// Get user's progress for all videos
export const getUserProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

// Get user's progress for a specific video
export const getVideoProgress = async (videoId) => {
  const response = await api.get(`/progress/${videoId}`);
  return response.data;
};

// Update progress for a video
export const updateProgress = async (videoId, progressData) => {
  const response = await api.post(`/progress/${videoId}`, progressData);
  return response.data;
};

// Reset progress for a video
export const resetProgress = async (videoId) => {
  const response = await api.delete(`/progress/${videoId}`);
  return response.data;
};