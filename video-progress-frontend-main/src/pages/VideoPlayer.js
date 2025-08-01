import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoContext } from '../contexts/VideoContext';
import VideoPlayerComponent from '../components/video/VideoPlayerComponent'; // Correct path and name

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentVideo, loading, error, getVideo } = useContext(VideoContext);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        await getVideo(id);
      } catch (err) {
        console.error('Error fetching video:', err);
      }
    };

    fetchVideo();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h1>Error</h1>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    );
  }

  // --- CRUCIAL FIX HERE: Conditionally render VideoPlayerComponent ---
  // Only render VideoPlayerComponent if currentVideo is not null/undefined
  if (!currentVideo) {
    // This block catches the case where loading is false but video hasn't loaded or doesn't exist
    return (
      <div className="not-found">
        <h1>Video Not Found</h1>
        <p>The video you are looking for does not exist or is still loading.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      {/* VideoPlayerComponent will now only render when currentVideo is guaranteed to be available */}
      <VideoPlayerComponent video={currentVideo} />
    </div>
  );
};

export default VideoPlayer;