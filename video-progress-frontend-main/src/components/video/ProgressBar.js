import React, { useEffect, useState } from 'react';

const ProgressBar = ({ percentage, intervals, duration, currentTime }) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [realTimeProgress, setRealTimeProgress] = useState(0);

  // Update display percentage with animation
  useEffect(() => {
    setDisplayPercentage(percentage || 0);
  }, [percentage]);

  // Update real-time progress when currentTime changes
  useEffect(() => {
    if (currentTime && duration) {
      const realTimePercentage = (currentTime / duration) * 100;
      setRealTimeProgress(realTimePercentage);
    }
  }, [currentTime, duration]);

  // Convert percentage to width style
  const progressStyle = {
    width: `${displayPercentage}%`,
    transition: 'width 0.5s ease-in-out'
  };

  // Real-time progress indicator style
  const realTimeStyle = {
    position: 'absolute',
    left: 0,
    width: `${realTimeProgress}%`,
    height: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.7)', // Green color
    borderRadius: '5px',
    transition: 'width 0.1s linear',
    zIndex: 2
  };

  // Generate segments for watched intervals
  const generateSegments = () => {
    if (!intervals || intervals.length === 0 || !duration) {
      return null;
    }

    console.log('Generating segments for intervals:', intervals);

    return intervals.map((interval, index) => {
      if (typeof interval.start !== 'number' || typeof interval.end !== 'number') {
        console.error('Invalid interval:', interval);
        return null;
      }

      const startPercent = (interval.start / duration) * 100;
      const widthPercent = ((interval.end - interval.start + 1) / duration) * 100;

      console.log(`Segment ${index}: start=${startPercent}%, width=${widthPercent}%`);

      const segmentStyle = {
        position: 'absolute',
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
        height: '100%',
        backgroundColor: 'rgba(63, 81, 181, 0.5)',
        borderRadius: '5px',
        zIndex: 1
      };

      return <div key={index} style={segmentStyle}></div>;
    }).filter(Boolean);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number') return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ position: 'relative', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden', margin: '1rem 0' }}>
        <div className="progress-bar-fill" style={{ ...progressStyle, height: '100%', backgroundColor: '#3f51b5', borderRadius: '5px', zIndex: 0 }}></div>
        <div className="real-time-indicator" style={realTimeStyle}></div>
        <div className="progress-segments" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {generateSegments()}
        </div>
      </div>
      <div className="progress-text">
        <span>{Math.round(displayPercentage)}% watched</span>
        <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#666' }}>
          ({intervals?.length || 0} intervals)
        </span>

      </div>
    </div>
  );
};

export default ProgressBar;