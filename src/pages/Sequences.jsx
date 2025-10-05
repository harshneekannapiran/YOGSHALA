import { useNavigate } from 'react-router-dom';
import SequenceBuilder from '../components/SequenceBuilder';
import SequenceCard from '../components/SequenceCard';
import ChatBot from '../components/ChatBot';
import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api'; 
import '../styles/sequences.css';

const Sequences = ({ userName }) => {
  const [sequences, setSequences] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log("Current userName prop:", userName); // Debug log

  useEffect(() => {
    const loadSequences = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Load user sequences from backend
        const response = await fetch(`${API_ENDPOINTS.SEQUENCES}/user/${userName}`);
        if (!response.ok) {
          throw new Error('Failed to load sequences');
        }
        
        const userSequences = await response.json();
        console.log('Loaded user sequences:', userSequences); // Debug log
        
        // Load default sequences
        const defaultResponse = await fetch(`${API_ENDPOINTS.SEQUENCES}/defaults`);
        const defaultSequences = await defaultResponse.json();
        console.log('Loaded default sequences:', defaultSequences); // Debug log
        
        setSequences([...defaultSequences, ...userSequences]);
      } catch (err) {
        setError('Failed to load sequences');
        console.error('Error loading sequences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userName) {
      loadSequences();
    }
  }, [userName]);

  const handleSaveSequence = async (newSequence) => {
    try {
      setError('');
      
      // Debug the userName value
      console.log('Attempting to save sequence for user:', userName);
      
      if (!userName || userName === 'undefined') {
        throw new Error('Please log in to save sequences (no username detected)');
      }

      // Validate sequence data
      if (!newSequence.name?.trim()) {
        throw new Error('Sequence name is required');
      }
      if (!newSequence.poses?.length) {
        throw new Error('At least one pose is required');
      }

      const sequenceData = {
        username: userName,
        name: newSequence.name.trim(),
        poses: newSequence.poses.map(pose => ({
          name: pose.name.trim(),
          duration: Math.max(10, Number(pose.duration) || 60)
        }))
      };

      console.log('Sending sequence data:', sequenceData); // Debug log

      const response = await fetch(API_ENDPOINTS.SEQUENCES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sequenceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save sequence');
      }

      const savedSequence = await response.json();
      console.log('Saved sequence:', savedSequence); // Debug log
      
      // Add the new sequence to the state
      setSequences(prev => [...prev, savedSequence]);
      setShowBuilder(false);
    } catch (err) {
      console.error('Save sequence error:', err); // Detailed error log
      setError(err.message);
    }
  };

  const handleDeleteSequence = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this sequence?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.SEQUENCES}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete sequence');
      }
      
      setSequences(prev => prev.filter(seq => seq._id !== id && seq.id !== id));
    } catch (err) {
      setError('Failed to delete sequence');
      console.error('Error deleting sequence:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="sequences-container loading">
        <div className="loader"></div>
        <p>Loading your sequences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sequences-container error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="sequences-container">
      <div className="sequences-header">
        <h1>Yoga Sequences</h1>
        <button 
          onClick={() => setShowBuilder(true)}
          className="create-sequence-button"
        >
          Create New Sequence
        </button>
      </div>

      {showBuilder ? (
        <SequenceBuilder 
          onSave={handleSaveSequence} 
          onCancel={() => setShowBuilder(false)}
        />
      ) : (
        <div className="sequences-grid">
          {sequences.map(sequence => (
            <SequenceCard 
              key={sequence._id || sequence.id} 
              sequence={sequence}
              isDefault={sequence.isDefault || false}
              onClick={() => navigate(`/dashboard?sequenceId=${sequence._id || sequence.id}`)}
              onDelete={() => handleDeleteSequence(sequence._id || sequence.id)}
            />
          ))}
        </div>
      )}
      <ChatBot poses={[]} /> 
    </div>
  );
};

export default Sequences;