import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAllVideos, getVideo as fetchSingleVideo } from '../services/videoService';
import { getVideoProgress as fetchVideoProgressService, updateProgress as updateProgressService, resetProgress as resetProgressService } from '../services/progressService';
import { AuthContext } from './AuthContext';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to map _id to id for frontend consistency
  const mapVideoId = useCallback((video) => {
    if (video && video._id) {
      return { ...video, id: video._id };
    }
    return video;
  }, []);

  // Get all videos
  const getVideos = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching all videos');
      const res = await getAllVideos();
      console.log('Videos response:', res);
      // Map _id to id for each video
      const mappedVideos = res.data.map(mapVideoId); // <--- ADDED MAPPING HERE
      setVideos(mappedVideos);
      setError(null);
      return mappedVideos; // Return mapped videos
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.message || 'Error fetching videos');
      return [];
    } finally {
      setLoading(false);
    }
  }, [mapVideoId]);

  // Get single video
  const getVideo = useCallback(async (id) => {
    setLoading(true);
    try {
      console.log('Fetching video with ID:', id);
      const res = await fetchSingleVideo(id);
      console.log('Video response:', res);
      // Map _id to id for the current video
      const mappedCurrentVideo = mapVideoId(res.data); // <--- ADDED MAPPING HERE
      setCurrentVideo(mappedCurrentVideo);

      // If authenticated and progress data is returned, set it
      // Ensure progress.videoId is also mapped if needed, or backend sends it as 'id'
      if (isAuthenticated && res.progress) {
        console.log('Setting progress from video response:', res.progress);
        setProgress(res.progress); // Assuming progress.videoId matches the video's _id/id
      } else if (isAuthenticated) {
        // If authenticated but no progress data, try to fetch it separately
        fetchVideoProgress(id); // Call local function
      }

      setError(null);
      return { ...res, data: mappedCurrentVideo }; // Return mapped video in the response
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.response?.data?.message || 'Error fetching video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, mapVideoId]);

  // Get user's progress for a video
  const fetchVideoProgress = useCallback(async (videoId) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping progress fetch');
      return null;
    }

    try {
      console.log('Fetching progress for video:', videoId);
      const res = await fetchVideoProgressService(videoId);
      console.log('Progress response:', res);

      if (res.success && res.data) {
        // Ensure progress.videoId is consistent with video.id
        // If backend sends videoId as _id, it needs to be mapped here too
        const mappedProgress = { ...res.data, videoId: res.data.videoId || res.data._id }; // Handle potential _id on progress object
        console.log('Setting progress from progress response:', mappedProgress);
        setProgress(mappedProgress);
        setError(null);
        return mappedProgress;
      }
      return null;
    } catch (err) {
      console.error('Error fetching progress:', err);
      return null;
    }
  }, [isAuthenticated]);

  // Update progress for a video
  const updateProgress = useCallback(async (videoId, data) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping progress update');
      return null;
    }

    try {
      console.log('Updating progress for video:', videoId, data);
      const res = await updateProgressService(videoId, data);
      console.log('Update progress response:', res);

      if (res.success && res.data) {
        const mappedProgress = { ...res.data, videoId: res.data.videoId || res.data._id };
        console.log('Setting progress from update response:', mappedProgress);
        setProgress(mappedProgress);
        setError(null);
        return mappedProgress;
      }
      return null;
    } catch (err) {
      console.error('Error updating progress:', err);
      return null;
    }
  }, [isAuthenticated]);

  // Reset progress for a video
  const resetProgress = useCallback(async (videoId) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping progress reset');
      return null;
    }

    try {
      console.log('Resetting progress for video:', videoId);
      const res = await resetProgressService(videoId);
      console.log('Reset progress response:', res);

      if (res.success && res.data) {
        const mappedProgress = { ...res.data, videoId: res.data.videoId || res.data._id };
        console.log('Setting progress from reset response:', mappedProgress);
        setProgress(mappedProgress);
        setError(null);
        return mappedProgress;
      }
      return null;
    } catch (err) {
      console.error('Error resetting progress:', err);
      return null;
    }
  }, [isAuthenticated]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos,
        currentVideo,
        progress,
        loading,
        error,
        getVideos,
        getVideo,
        getVideoProgress: fetchVideoProgress,
        updateProgress,
        resetProgress,
        clearError
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};