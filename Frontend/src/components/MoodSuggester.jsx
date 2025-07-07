import { useState } from 'react';

const moodMap = {
  Relaxed: ["Child's Pose", 'Mountain Pose', 'Bridge Pose'],
  Energetic: ['Warrior II', 'Crow Pose', 'Headstand'],
  Anxious: ['Cobra Pose', 'Tree Pose', 'Downward Dog'],
  Tired: ["Child's Pose", 'Bridge Pose', 'Mountain Pose'],
};

const MoodSuggester = ({ poses }) => {
  const [activeMood, setActiveMood] = useState(null);
  const [suggested, setSuggested] = useState([]);

  const handleMoodClick = (mood) => {
    if (activeMood === mood) {
      // Clicking again collapses the suggestion
      setActiveMood(null);
      setSuggested([]);
    } else {
      const matched = poses.filter(p => moodMap[mood].includes(p.name));
      setSuggested(matched.map(p => p.name));
      setActiveMood(mood);
    }
  };

  return (
    <div className="mood-suggester">
      <h3>How are you feeling?</h3>
      <div className="mood-buttons">
        {Object.keys(moodMap).map((mood) => (
          <button key={mood} onClick={() => handleMoodClick(mood)}>
            {mood} {activeMood === mood ? '▲' : ''}
          </button>
        ))}
      </div>

      {suggested.length > 0 && (
        <div className="suggested-list">
          <h4>Suggested Poses:</h4>
          <ul>
            {suggested.map((pose, i) => (
              <li key={i}>{pose}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodSuggester;
