import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';

const SequenceBuilder = ({ onSave, onCancel }) => {
  const [sequenceName, setSequenceName] = useState(''), [poses, setPoses] = useState([{ name: '', duration: 60 }]), [availablePoses, setAvailablePoses] = useState([]), [isLoading, setIsLoading] = useState(true), [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(API_ENDPOINTS.POSES);
        const data = await response.json();
        setAvailablePoses(data.map(p => p.name));
      } catch (err) {
        setError('Failed to load poses. Please try again.');
        console.error('Error fetching poses:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleAddPose = () => {
    setPoses([...poses, { name: '', duration: 60 }]);
  };

  const handleRemovePose = (index) => {
    setPoses(poses.filter((_, idx) => idx !== index));
  };

  const handlePoseChange = (index, field, value) => {
    setPoses(poses.map((p, idx) => idx === index ? { ...p, [field]: field === 'duration' ? parseInt(value) : value } : p));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!sequenceName.trim()) {
      setError('Please enter a sequence name');
      return;
    }
    
    const validPoses = poses.filter(p => p.name.trim());
    if (validPoses.length === 0) {
      setError('Please select at least one valid pose');
      return;
    }
    
    // Add this debug log
    console.log('Submitting sequence for user');
    
    onSave({
      name: sequenceName,
      poses: validPoses
    });
  };

  if (isLoading) {
    return (
      <div className="sequence-builder loading">
        <div className="loader"></div>
        <p>Loading poses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sequence-builder error">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="sequence-builder">
      <h2>Create New Sequence</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sequence Name:</label>
          <input
            type="text"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            placeholder="Enter sequence name"
            required
          />
        </div>

        <div className="poses-list">
          <h3>Poses</h3>
          {poses.map((pose, i) => (
            <div key={i} className="pose-row">
              <select
                value={pose.name}
                onChange={(e) => handlePoseChange(i, 'name', e.target.value)}
                required
              >
                <option value="">Select a pose</option>
                {availablePoses.map((poseName, idx) => (
                  <option key={idx} value={poseName}>{poseName}</option>
                ))}
              </select>
              <select
                value={pose.duration}
                onChange={(e) => handlePoseChange(i, 'duration', e.target.value)}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={90}>1.5 minutes</option>
                <option value={120}>2 minutes</option>
                <option value={180}>3 minutes</option>
              </select>
              {poses.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemovePose(i)}
                  className="remove-pose-button"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddPose}
            className="add-pose-button"
          >
            Add Pose
          </button>
        </div>

        <div className="builder-buttons">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save Sequence</button>
        </div>
      </form>
    </div>
  );
};

export default SequenceBuilder;