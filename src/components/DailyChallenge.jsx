import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';
import mountain from '../assets/images/mountain.jpg';
import downwarddog from '../assets/images/downwarddog.avif';
import warrior2 from '../assets/images/warrior2.avif';
import tree from '../assets/images/tree.avif';
import headstand from '../assets/images/headstand.avif';
import crow from '../assets/images/crow.jpg';
import child from '../assets/images/child.avif';
import bridge from '../assets/images/bridge.avif';
import cobra from '../assets/images/cobra.avif';

const getPoseImage = poseName => ({'Mountain Pose':mountain,'Downward Dog':downwarddog,'Warrior II':warrior2,'Tree Pose':tree,'Headstand':headstand,'Crow Pose':crow,"Child's Pose":child,'Bridge Pose':bridge,'Cobra Pose':cobra}[poseName]||null);

const DailyChallenge = ({ poses, onComplete, userName, onTakeChallenge, completedPoseName }) => {
  const [todaysChallenge, setTodaysChallenge] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!userName) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch daily challenge from backend
        const response = await fetch(`${API_ENDPOINTS.PROGRESS}/daily-challenge/${userName}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load challenge');
        }

        // Find the full pose details from local poses
        const fullPoseDetails = poses.find(p => p.name === data.pose.name) || data.pose;

        // Enrich pose data with image and full details
        const enrichedPose = {
          ...fullPoseDetails,
          image: getPoseImage(data.pose.name),
          duration: fullPoseDetails.duration || data.pose.duration || 60,
          instruction: fullPoseDetails.instruction || data.pose.instruction || '',
          benefits: fullPoseDetails.benefits || data.pose.benefits || ''
        };

        setTodaysChallenge({ 
          ...data, 
          pose: enrichedPose 
        });
        setIsCompleted(data.completed || completedPoseName === data.pose.name);
      } catch (error) {
        console.error('Error loading challenge:', error);
        setError('Failed to load daily challenge');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [userName, completedPoseName, poses]);

  const handleTakeChallenge = () => {
    if (todaysChallenge?.pose && onTakeChallenge) {
      onTakeChallenge({
        ...todaysChallenge.pose,
        // Ensure all required fields are included
        name: todaysChallenge.pose.name,
        difficulty: todaysChallenge.pose.difficulty,
        benefits: todaysChallenge.pose.benefits,
        duration: todaysChallenge.pose.duration,
        instruction: todaysChallenge.pose.instruction,
        image: todaysChallenge.pose.image
      });
    }
  };

  const formatBenefits = b => Array.isArray(b) ? b.join(', ') : typeof b === 'string' ? b : Object.values(b).join(', ');

  if (isLoading) {
    return (
      <div className="daily-challenge loading">
        <div className="loader small"></div>
        <p>Loading today's challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-challenge error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!todaysChallenge || !todaysChallenge.pose) {
    return (
      <div className="daily-challenge">
        <p>No challenge available today</p>
      </div>
    );
  }

  return (
    <div className={`daily-challenge ${isCompleted ? 'completed' : ''}`}>
      <div
        className="challenge-header"
        onClick={() => setShowDetails(prev => !prev)}
        style={{ cursor: 'pointer' }}
      >
        <h3>Daily Challenge {isCompleted && '✓'}</h3>
        <span>{showDetails ? '▲' : '▼'}</span>
      </div>

      {showDetails && (
        <div className="challenge-details">
          <div className="challenge-pose-info">
            <p><strong>Today's Challenge:</strong> {todaysChallenge.pose.name}</p>
            <p><strong>Difficulty:</strong> {todaysChallenge.pose.difficulty}</p>
            <p><strong>Benefits:</strong> {formatBenefits(todaysChallenge.pose.benefits)}</p>
          </div>

          {!isCompleted ? (
            <>
              <button 
                className="complete-button" 
                onClick={handleTakeChallenge}
                disabled={isLoading}
              >
                Take Challenge
              </button>
              <p className="challenge-instruction">
                This will start the pose timer. On completion, challenge will be marked done.
              </p>
            </>
          ) : (
            <p className="completion-message">
              Great job, {userName}! Come back tomorrow for a new challenge.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyChallenge;