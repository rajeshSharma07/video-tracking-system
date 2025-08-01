import React from 'react';
import ReactPlayer from 'react-player';
import useVideoProgress from '../../hooks/useVideoProgress';
import ProgressBar from './ProgressBar';

const VideoPlayerComponent = ({ video }) => {
  const {
    watchedIntervals,
    progressPercentage,
    lastPosition,
    getPlayerRef,
    handlePlay,
    handlePause,
    handleSeek,
    handleEnded
  } = useVideoProgress(video.id, video.duration);

  return (
    <div className="video-playback-container">
      <div className="video-wrapper">
        <ReactPlayer
          className="react-player" // ✅ Ensures correct video sizing
          ref={getPlayerRef}
          url={video.url}
          controls={true}
          width="100%"
          height="100%"
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onEnded={handleEnded}
          config={{
            youtube: {
              playerVars: { playsinline: 1 }
            }
          }}
        />
      </div>

      <ProgressBar
        percentage={progressPercentage}
        intervals={watchedIntervals}
        duration={video.duration}
        currentTime={lastPosition}
      />

      <div className="video-details">
        <h1>{video.title}</h1>
        <p className="video-description">{video.description}</p>
        <p className="video-duration-text">
          Duration: {Math.floor(video.duration / 60)}m {Math.floor(video.duration % 60)}s
        </p>
      </div>

      <style jsx="true">{`
        .video-playback-container {
          width: 100%;
          margin: 0 auto 2rem;
          background-color: var(--background-light);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }

        .video-wrapper {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          width: 100%;
          overflow: hidden;
        }

        .react-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
        }

        .video-details {
          padding: 1.5rem;
        }

        .video-details h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .video-description {
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        .video-duration-text {
          font-size: 0.9em;
          color: var(--text-lighter);
        }
      `}</style>
    </div>
  );
};

export default VideoPlayerComponent;
