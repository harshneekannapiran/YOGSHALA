import { useState, useEffect, useRef } from 'react';

const PoseTimer = ({
  pose,
  onComplete,
  onCancel,
  isPaused,
  onTogglePause,
  isMusicEnabled,
  toggleMusic,
}) => {
  const [timeLeft, setTimeLeft] = useState(pose.duration);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeLeft(pose.duration);
  }, [pose]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timeLeft === 0) {
        onComplete();
      }
      return;
    }

    let timer;
    if (!isPaused) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onComplete]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicEnabled) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isMusicEnabled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePoseComplete = async () => {
    // Wait for progress update and get if daily challenge was completed
    const dailyChallengeCompleted = await updateProgressInDatabase(pose.name);

    // Show daily challenge alert first if needed
    if (dailyChallengeCompleted) {
      alert('🎉 Daily Challenge Completed!');
    }

    // Now handle sequence/pose completion
    if (!handleNextPose()) {
      alert(`🎉 You completed the ${pose.name}!`);
      setCurrentPose(null);
      setCurrentSequence(null);
      setSequenceIndex(0);
    }
  };

  return (
    <div className="pose-timer">
      <div className="timer-left">
        <img src={pose.image} alt={pose.name} className="timer-pose-image" />
      </div>

      <div className="timer-right">
        <div className="timer-content">
          <h2 className="pose-title">{pose.name}</h2>
          <div className="timer-display">{formatTime(timeLeft)}</div>

          <div className="timer-controls">
            <button
              onClick={onTogglePause}
              className={isPaused ? 'resume-button' : 'pause-button'}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          </div>

          <div className="music-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={isMusicEnabled}
                onChange={toggleMusic}
              />
              <span className="slider round"></span>
            </label>
            <span className="music-label">
              {isMusicEnabled ? 'Music: ON' : 'Music: OFF'}
            </span>
            <audio ref={audioRef} loop>
              <source src="/music/calm-meditation.mp3" type="audio/mpeg" />
            </audio>
          </div>

          {pose.instruction && (
            <p className="timer-instruction">
              <strong>How to:</strong> {pose.instruction}
            </p>
          )}
          <p className="timer-benefits">{pose.benefits}</p>
        </div>
      </div>
    </div>
  );
};

export default PoseTimer;
