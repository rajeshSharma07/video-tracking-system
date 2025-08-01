import api from './api';

// Get all videos
export const getAllVideos = async () => {
  const response = await api.get('/videos');
  return response.data;
};

// Get single video
export const getVideo = async (id) => {
  const response = await api.get(`/videos/${id}`);
  return response.data;
};

// Create new video (admin only)
export const createVideo = async (videoData) => {
  const response = await api.post('/videos', videoData);
  return response.data;
};

// Update video (admin only)
export const updateVideo = async (id, videoData) => {
  const response = await api.put(`/videos/${id}`, videoData);
  return response.data;
};

// Delete video (admin only)
export const deleteVideo = async (id) => {
  const response = await api.delete(`/videos/${id}`);
  return response.data;
};