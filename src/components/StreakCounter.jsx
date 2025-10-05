import { useEffect, useState } from 'react';

const StreakCounter = ({ streak }) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (streak > 0 && streak % 5 === 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  return (
    <div className="streak-counter">
      <div className="streak-display">
        🔥 {streak} day streak
      </div>
      {showCelebration && (
        <div className="celebration">
          Amazing! {streak} days in a row! Keep it up!
        </div>
      )}
    </div>
  );
};

export default StreakCounter;