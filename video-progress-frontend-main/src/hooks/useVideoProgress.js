import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import { AuthContext } from '../contexts/AuthContext';
import { mergeIntervals, calculateUniqueWatchedTime, calculateProgressPercentage } from '../utils/progressUtils';

/**
 * Custom hook for tracking video progress
 * @param {string} videoId - The ID of the video
 * @param {number} videoDuration - The total duration of the video in seconds
 * @returns {Object} - Methods and state for tracking progress
 */
const useVideoProgress = (videoId, videoDuration) => {
  const { progress, updateProgress, getVideoProgress } = useContext(VideoContext);
  const { isAuthenticated } = useContext(AuthContext);

  // State for tracking watched intervals
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);

  // Refs for tracking
  const playerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const lastTimeUpdateRef = useRef(0);
  const updateIntervalRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const lastSaveTimeRef = useRef(0);

  // Initialize progress from server
  useEffect(() => {
    const fetchProgress = async () => {
      if (isAuthenticated && videoId) {
        try {
          const progressData = await getVideoProgress(videoId);
          console.log('Fetched progress data:', progressData);
          if (progressData && playerRef.current) {
            // Seek to last position when video loads if it's not at the very beginning
            if (progressData.lastPosition > 0 && progressData.lastPosition < videoDuration) {
                playerRef.current.seekTo(progressData.lastPosition, 'seconds');
                setLastPosition(progressData.lastPosition);
            }
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }
    };

    fetchProgress();

    return () => {
      // Clean up intervals and timeouts
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [videoId, getVideoProgress, isAuthenticated, videoDuration]);

  // Update local state when progress changes from server
  useEffect(() => {
    if (progress) {
      console.log('Progress updated from server:', progress);
      setWatchedIntervals(progress.watchedIntervals || []);
      setProgressPercentage(progress.progressPercentage || 0);
      setLastPosition(progress.lastPosition || 0);
    }
  }, [progress]);

  // Save progress to server with debounce
  const saveProgress = useCallback((intervals, percentage, currentTime) => {
    // Only save progress if authenticated
    if (!isAuthenticated) return;

    // Don't save too frequently
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 5000) { // 5 seconds minimum between saves
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout to save progress
    saveTimeoutRef.current = setTimeout(async () => {
      if (!playerRef.current) {
        console.warn('Player reference not available when saving progress');
        return;
      }

      try {
        let timeToSave = currentTime;
        if (typeof timeToSave !== 'number') {
          try {
            timeToSave = Math.floor(playerRef.current.getCurrentTime());
          } catch (error) {
            console.error('Error getting current time:', error);
            timeToSave = lastPosition;
          }
        }

        console.log('Saving progress:', {
          videoId,
          intervals,
          currentTime: timeToSave,
          percentage
        });

        await updateProgress(videoId, {
          intervals,
          currentTime: timeToSave,
          progressPercentage: percentage
        });

        lastSaveTimeRef.current = Date.now();
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }, 1000); // Debounce for 1 second
  }, [isAuthenticated, lastPosition, updateProgress, videoId]);

  // Start tracking when video plays
  const handlePlay = useCallback(() => {
    if (!playerRef.current) {
      console.warn('Player reference is not set in handlePlay');
      return;
    }

    isPlayingRef.current = true;

    try {
      // Start a new interval if not already tracking
      if (!currentInterval) {
        let currentTime;
        try {
          currentTime = Math.floor(playerRef.current.getCurrentTime());
        } catch (error) {
          console.error('Error getting current time:', error);
          currentTime = 0;
        }

        console.log('Starting new interval at:', currentTime);
        setCurrentInterval({ start: currentTime, end: currentTime });
      }

      // Start interval to update current interval while playing
      if (!updateIntervalRef.current) {
        updateIntervalRef.current = setInterval(() => {
          if (isPlayingRef.current && playerRef.current) {
            try {
              const currentTime = Math.floor(playerRef.current.getCurrentTime());

              // Update the end time of the current interval
              setCurrentInterval(prev => {
                if (prev) {
                  // Only log occasionally to reduce console spam
                  if (currentTime % 5 === 0) {
                    console.log('Updating interval:', { ...prev, end: currentTime });
                  }
                  return { ...prev, end: currentTime };
                }
                console.log('Creating new interval:', { start: currentTime, end: currentTime });
                return { start: currentTime, end: currentTime };
              });

              // Update last time update
              lastTimeUpdateRef.current = currentTime;

              // Update progress percentage in real-time
              if (currentInterval) {
                const tempIntervals = [...watchedIntervals, { ...currentInterval, end: currentTime }];
                const mergedTempIntervals = mergeIntervals(tempIntervals);
                const newPercentage = calculateProgressPercentage(mergedTempIntervals, videoDuration);
                setProgressPercentage(newPercentage);

                // Save progress periodically while playing
                saveProgress(mergedTempIntervals, newPercentage, currentTime);
              }
            } catch (error) {
              console.error('Error updating interval:', error);
            }
          }
        }, 1000); // Update every second
      }
    } catch (error) {
      console.error('Error in handlePlay:', error);
    }
  }, [calculateProgressPercentage, currentInterval, mergeIntervals, saveProgress, videoDuration, watchedIntervals]);

  // Stop tracking when video pauses
  const handlePause = useCallback(() => {
    console.log('Handling pause, isPlaying:', isPlayingRef.current);
    isPlayingRef.current = false;

    // Add the current interval to watched intervals if it exists
    if (currentInterval) {
      console.log('Current interval on pause:', currentInterval);
      setWatchedIntervals(prev => {
        const newIntervals = [...prev, currentInterval];
        console.log('All intervals before merge:', newIntervals);
        const mergedIntervals = mergeIntervals(newIntervals);
        console.log('Merged intervals:', mergedIntervals);

        // Calculate new progress percentage
        const newPercentage = calculateProgressPercentage(mergedIntervals, videoDuration);
        console.log('New progress percentage:', newPercentage);
        setProgressPercentage(newPercentage);

        // Save progress to server if authenticated
        if (isAuthenticated) {
          saveProgress(mergedIntervals, newPercentage);
        }

        return mergedIntervals;
      });

      // Reset current interval
      setCurrentInterval(null);
    }

    // Clear update interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  }, [calculateProgressPercentage, currentInterval, isAuthenticated, mergeIntervals, saveProgress, videoDuration]);

  // Handle seeking in the video
  const handleSeek = useCallback((seconds) => {
    console.log('Handling seek to:', seconds);
    const currentTime = Math.floor(seconds);

    // If playing, update the current interval or create a new one
    if (isPlayingRef.current) {
      // If the seek is far from the last update, end the current interval and start a new one
      if (Math.abs(currentTime - lastTimeUpdateRef.current) > 3) {
        console.log('Seek distance > 3, creating new interval');
        // Add the current interval to watched intervals if it exists
        if (currentInterval) {
          setWatchedIntervals(prev => {
            const newIntervals = [...prev, currentInterval];
            return mergeIntervals(newIntervals);
          });
        }

        // Start a new interval at the seek position
        setCurrentInterval({ start: currentTime, end: currentTime });
      }
    }

    // Update last time update
    lastTimeUpdateRef.current = currentTime;
    setLastPosition(currentTime);
  }, [currentInterval, mergeIntervals]);

  // Handle video end
  const handleEnded = useCallback(() => {
    console.log('Handling video end');
    isPlayingRef.current = false;

    // Add the current interval to watched intervals if it exists
    if (currentInterval) {
      setWatchedIntervals(prev => {
        const newIntervals = [...prev, currentInterval];
        const mergedIntervals = mergeIntervals(newIntervals);

        // Calculate new progress percentage
        const newPercentage = calculateProgressPercentage(mergedIntervals, videoDuration);
        setProgressPercentage(newPercentage);

        // Save progress to server if authenticated
        if (isAuthenticated) {
          saveProgress(mergedIntervals, newPercentage);
        }

        return mergedIntervals;
      });

      // Reset current interval
      setCurrentInterval(null);
    }

    // Clear update interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  }, [calculateProgressPercentage, currentInterval, isAuthenticated, mergeIntervals, saveProgress, videoDuration]);

  // Get player reference
  const getPlayerRef = useCallback((player) => {
    console.log('Setting player reference in hook:', player);
    playerRef.current = player;
  }, []);

  return {
    watchedIntervals,
    progressPercentage,
    lastPosition,
    getPlayerRef,
    handlePlay,
    handlePause,
    handleSeek,
    handleEnded
  };
};

export default useVideoProgress;