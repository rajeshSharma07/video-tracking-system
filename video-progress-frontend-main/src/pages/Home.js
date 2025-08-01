import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { VideoContext } from '../contexts/VideoContext';
import { AuthContext } from '../contexts/AuthContext';
import VideoCard from '../components/video/VideoCard';

const Home = () => {
  const { videos = [], loading, getVideos } = useContext(VideoContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line
  }, []);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || typeof seconds !== 'number') return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Track Your Learning Progress</h1>
          <p className="hero-subtitle">
            Never lose your place in educational videos again. Our advanced tracking system
            remembers exactly which parts you've watched.
          </p>
          {!isAuthenticated && (
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Sign In
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            alt="Video Learning"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose VideoTracker?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <h3 className="feature-title">Precise Tracking</h3>
            <p className="feature-description">
              Our system tracks exactly which parts of a video you've watched, down to the second.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <h3 className="feature-title">Secure Progress</h3>
            <p className="feature-description">
              Your progress is securely saved to your account, accessible from any device.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03c-.02 1.64-1.35 2.97-3 2.97-1.66 0-3-1.34-3-3z" />
              </svg>
            </div>
            <h3 className="feature-title">Resume Anywhere</h3>
            <p className="feature-description">
              Pick up exactly where you left off, even if you switch devices.
            </p>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="videos-section">
        <h2 className="section-title">Available Videos</h2>

        {!videos || videos.length === 0 ? (
          <div className="no-videos">
            <p>No videos available at the moment.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-item">
                <Link to={`/video/${video.id}`} className="video-link">
                  <div className="video-thumbnail-container">
                    <img
                      src={video.thumbnail || 'https://via.placeholder.com/300x169'}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <div className="video-overlay">
                      <span className="video-play-icon">▶</span>
                    </div>
                    <span className="video-duration">{formatTime(video.duration)}</span>
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated ? (
          <div className="videos-cta">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="videos-cta">
            <Link to="/register" className="btn btn-primary">
              Sign Up to Track Progress
            </Link>
          </div>
        )}
      </section>

      <style jsx="true">{`
        .home-page {
          animation: fadeIn 0.5s ease-in-out;
        }

        /* Hero Section */
        .hero-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 4rem;
          padding: 2rem 0;
        }

        .hero-content {
          flex: 1;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-color);
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-light);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
        }

        .hero-image {
          flex: 1;
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--box-shadow);
        }

        .hero-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hero-image:hover img {
          transform: scale(1.05);
        }

        /* Features Section */
        .features-section {
          margin-bottom: 4rem;
          padding: 3rem 0;
          background-color: var(--background-dark);
          border-radius: var(--border-radius);
        }

        .section-title {
          text-align: center;
          margin-bottom: 3rem;
          font-size: 2.25rem;
          font-weight: 700;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background-color: var(--background-light);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--box-shadow-hover);
        }

        .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          margin-bottom: 1.5rem;
        }

        .feature-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Videos Section */
        .videos-section {
          margin-bottom: 4rem;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .video-item {
          background-color: var(--background-light);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--box-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .video-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-hover);
        }

        .video-link {
          display: block;
          color: var(--text-color);
          text-decoration: none;
        }

        .video-thumbnail-container {
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
          transition: transform 0.5s ease;
        }

        .video-item:hover .video-thumbnail {
          transform: scale(1.1);
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
          transition: opacity 0.3s ease;
        }

        .video-item:hover .video-overlay {
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

        .video-title {
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .videos-cta {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .no-videos {
          text-align: center;
          padding: 3rem;
          background-color: var(--background-light);
          border-radius: var(--border-radius);
          color: var(--text-light);
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(79, 70, 229, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
          }

          .hero-title {
            font-size: 2.25rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;