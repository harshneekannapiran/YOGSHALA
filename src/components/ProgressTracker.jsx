import { useEffect, useState } from 'react';

const ProgressTracker = ({ userName }) => {
  const [history, setHistory] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching progress for user:', userName); // Debug log
        const response = await fetch(`${API_ENDPOINTS.PROGRESS}/${userName}`);
        console.log('Progress response status:', response.status); // Debug log
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const progressData = await response.json();
        console.log('Progress data received:', progressData); // Debug log
        
        setHistory(progressData.poseHistory || []);
        setTotalSessions(progressData.poseHistory?.length || 0);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userName) {
      fetchProgress();
    }
  }, [userName]);

  const today = new Date().toDateString();
  const dailyCount = history.filter(entry => 
    new Date(entry.date).toDateString() === today
  ).length;

  if (isLoading) {
    return (
      <div className="progress-tracker loading">
        <div className="loader small"></div>
      </div>
    );
  }

  return (
    <div className="progress-tracker">
      <h3>Your Progress</h3>
      <p>🗓️ Today's Poses Completed: <strong>{dailyCount}</strong></p>
      <p>📊 Total Sessions: <strong>{totalSessions}</strong></p>
    </div>
  );
};

export default ProgressTracker;