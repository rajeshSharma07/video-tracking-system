import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { VideoContext } from '../contexts/VideoContext';
import { AuthContext } from '../contexts/AuthContext';
import VideoCard from '../components/video/VideoCard';
import { getUserProgress } from '../services/progressService'; // Import progress service directly

const Dashboard = () => {
  const { videos, loading, getVideos } = useContext(VideoContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const [videoProgress, setVideoProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getVideos();
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  // Fetch progress for each video
  useEffect(() => {
    const fetchProgress = async () => {
      if (videos.length > 0 && isAuthenticated) {
        setLoadingProgress(true);
        try {
          const response = await getUserProgress(); // Use service function
          console.log('Progress response:', response);

          if (response.success && response.data) {
            const progressMap = {};
            response.data.forEach(progress => {
              progressMap[progress.videoId] = progress;
            });
            setVideoProgress(progressMap);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        } finally {
          setLoadingProgress(false);
        }
      }
    };

    fetchProgress();
  }, [videos, isAuthenticated]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || typeof seconds !== 'number') return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Get videos with progress
  const getVideosWithProgress = () => {
    if (!videos || videos.length === 0) return [];

    return videos.map(video => ({
      ...video,
      progress: videoProgress[video.id] || null
    })).sort((a, b) => {
      // Sort by progress (videos in progress first)
      const aProgress = a.progress ? a.progress.progressPercentage : 0;
      const bProgress = b.progress ? b.progress.progressPercentage : 0;

      // If both have progress, sort by last watched
      if (aProgress > 0 && bProgress > 0) {
        const aLastWatched = a.progress.lastWatched ? new Date(a.progress.lastWatched) : new Date(0);
        const bLastWatched = b.progress.lastWatched ? new Date(b.progress.lastWatched) : new Date(0);
        return bLastWatched - aLastWatched; // Most recently watched first
      }

      // Otherwise, sort by progress percentage (descending)
      return bProgress - aProgress;
    });
  };

  // Get videos in progress (watched but not completed)
  const getVideosInProgress = () => {
    return getVideosWithProgress().filter(video =>
      video.progress &&
      video.progress.progressPercentage > 0 &&
      video.progress.progressPercentage < 95
    ).slice(0, 3); // Limit to 3 videos
  };

  const videosWithProgress = getVideosWithProgress();
  const videosInProgress = getVideosInProgress();

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="lead">Welcome {user && user.firstName ? user.firstName : user?.username}</p>

      <div className="dashboard-content">
        {videosInProgress.length > 0 && (
          <div className="dashboard-section">
            <h2>Continue Watching</h2>
            <div className="video-list">
              {videosInProgress.map(video => (
                <div key={video.id} className="video-list-item">
                  <Link to={`/video/${video.id}`} className="video-list-link">
                    <div className="video-thumbnail-container">
                      <img
                        src={video.thumbnail || 'https://via.placeholder.com/240x135'}
                        alt={video.title}
                        className="video-thumbnail"
                      />
                      <div className="video-duration">
                        {formatTime(video.duration)}
                      </div>
                    </div>
                    <div className="video-info">
                      <h3 className="video-title">{video.title}</h3>
                      <div className="video-progress-container">
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${video.progress ? video.progress.progressPercentage : 0}%`
                            }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {Math.round(video.progress ? video.progress.progressPercentage : 0)}% complete
                        </div>
                        <div className="last-position">
                          Resume at {formatTime(video.progress ? video.progress.lastPosition : 0)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-section">
          <h2>All Videos</h2>

          {videosWithProgress.length === 0 ? (
            <p>No videos available.</p>
          ) : (
            <div className="video-grid">
              {videosWithProgress.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  progress={video.progress}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .dashboard-page {
          padding: 1rem;
        }

        .dashboard-content {
          margin-top: 2rem;
        }

        .dashboard-section {
          margin-bottom: 2rem;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .video-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .video-list-item {
          background-color: #f5f5f5;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .video-list-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .video-list-link {
          display: flex;
          text-decoration: none;
          color: inherit;
          padding: 1rem;
        }

        .video-thumbnail-container {
          position: relative;
          width: 240px;
          min-width: 240px;
          height: 135px;
          border-radius: 4px;
          overflow: hidden;
        }

        .video-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.8rem;
        }

        .video-info {
          margin-left: 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .video-title {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .video-progress-container {
          margin-top: auto;
        }

        .progress-bar {
          height: 6px;
          background-color: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: #3f51b5;
          border-radius: 3px;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #666;
        }

        .last-position {
          font-size: 0.9rem;
          color: #3f51b5;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;