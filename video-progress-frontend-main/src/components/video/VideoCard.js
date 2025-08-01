import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video, progress }) => {
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds || typeof seconds !== 'number') return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (!progress) return 0;
    return progress.progressPercentage || 0;
  };

  // Get progress status
  const getProgressStatus = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 95) return 'Completed';
    if (percentage > 0) return `${Math.round(percentage)}% watched`;
    return 'Not started';
  };

  // Get progress status class
  const getProgressStatusClass = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 95) return 'completed';
    if (percentage > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="video-card">
      <div className="video-card-image">
        <Link to={`/video/${video._id}`}> {/* CHANGED HERE */}
          <img
            src={video.thumbnail || 'https://via.placeholder.com/300x169'}
            alt={video.title}
            className="video-thumbnail"
          />
          <div className="video-overlay">
            <span className="video-play-icon">▶</span>
          </div>
          <span className="video-duration">{formatDuration(video.duration)}</span>
          {progress && progress.lastPosition > 0 && (
            <span className="video-resume">
              Resume at {formatDuration(progress.lastPosition)}
            </span>
          )}
        </Link>
      </div>
      <div className="video-card-content">
        <h3 className="video-card-title">
          <Link to={`/video/${video._id}`}>{video.title}</Link> {/* CHANGED HERE */}
        </h3>
        <div className="video-card-progress">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className={`progress-text ${getProgressStatusClass()}`}>
            {getProgressStatus()}
          </span>
        </div>
      </div>

      <style jsx="true">{`
        .video-card {
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .video-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .video-card-image {
          position: relative;
          height: 0;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
        }

        .video-thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .video-play-icon {
          color: white;
          font-size: 3rem;
          filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
        }

        .video-duration {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .video-resume {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: rgba(63, 81, 181, 0.8);
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .video-card-content {
          padding: 1rem;
        }

        .video-card-title {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .video-card-title a {
          color: #333;
          text-decoration: none;
        }

        .video-card-title a:hover {
          color: #3f51b5;
        }

        .video-card-progress {
          margin-top: 0.5rem;
        }

        .progress-bar {
          height: 4px;
          background-color: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: #3f51b5;
          border-radius: 2px;
          transition: width 0.3s ease-in-out;
        }

        .progress-text {
          font-size: 0.8rem;
          color: #666;
        }

        .progress-text.completed {
          color: #4caf50;
        }

        .progress-text.in-progress {
          color: #3f51b5;
        }

        .progress-text.not-started {
          color: #9e9e9e;
        }
      `}</style>
    </div>
  );
};

export default VideoCard;