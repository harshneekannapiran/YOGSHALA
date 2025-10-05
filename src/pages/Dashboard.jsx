import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PoseCard from '../components/PoseCard';
import SearchBar from '../components/SearchBar';
import DifficultyFilter from '../components/DifficultyFilter';
import PoseTimer from '../components/PoseTimer';
import ChatBot from '../components/ChatBot';
import StreakCounter from '../components/StreakCounter';
import DailyChallenge from '../components/DailyChallenge';
import MusicPlayer from '../components/MusicPlayer';
import API_ENDPOINTS from '../config/api';
import ProgressTracker from '../components/ProgressTracker';
import MoodSuggester from '../components/MoodSuggester';
import LastLogin from '../components/LastLogin';
import '../styles/dashboard.css';

// Images
import mountain from '../assets/images/mountain.jpg';
import downwarddog from '../assets/images/downwarddog.avif';
import warrior2 from '../assets/images/warrior2.avif';
import tree from '../assets/images/tree.avif';
import headstand from '../assets/images/headstand.avif';
import crow from '../assets/images/crow.jpg';
import child from '../assets/images/child.avif';
import bridge from '../assets/images/bridge.avif';
import cobra from '../assets/images/cobra.avif';

const Dashboard = ({ userName }) => {
  const [poses, setPoses] = useState([]);
  const [filteredPoses, setFilteredPoses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentPose, setCurrentPose] = useState(null);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [isSequencePaused, setIsSequencePaused] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedDailyPoseName, setCompletedDailyPoseName] = useState(null);
  const [dailyChallengePose, setDailyChallengePose] = useState(null);
  const [searchParams] = useSearchParams();
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef(null);

  // Helper function to get pose image
  const getPoseImage = (poseName) => {
    const imageMap = {
      'Mountain Pose': mountain,
      'Downward Dog': downwarddog,
      'Warrior II': warrior2,
      'Tree Pose': tree,
      'Headstand': headstand,
      'Crow Pose': crow,
      "Child's Pose": child,
      'Bridge Pose': bridge,
      'Cobra Pose': cobra
    };
    return imageMap[poseName] || null;
  };

  // Fetch user progress on initial load
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        console.log('Dashboard: Fetching progress for user:', userName); // Debug log
        const response = await fetch(`${API_ENDPOINTS.PROGRESS}/${userName}`);
        console.log('Dashboard: Progress response status:', response.status); // Debug log
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dashboard: Progress data received:', data); // Debug log
        
        if (response.ok) {
          setStreak(data.streak || 0);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    if (userName) {
      fetchUserProgress();
    }
  }, [userName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize poses with images
        const mockPoses = [
          { id: 1, name: 'Mountain Pose', difficulty: 'Beginner', benefits: 'Improves posture, strengthens thighs and ankles, relieves back pain', image: mountain, duration: 60, instruction: 'Sit on your heels with back straight and palms pressed together in front of your chest.' },
          { id: 2, name: 'Downward Dog', difficulty: 'Beginner', benefits: 'Strengthens arms and legs, stretches shoulders and hamstrings, calms the mind', image: downwarddog, duration: 90, instruction: 'Start on hands and knees, lift hips to form an inverted V shape.' },
          { id: 3, name: 'Warrior II', difficulty: 'Intermediate', benefits: 'Strengthens legs and arms, improves balance and concentration, stretches groins', image: warrior2, duration: 120, instruction: 'Step feet wide, turn front foot out, bend knee, and stretch arms parallel to floor.' },
          { id: 4, name: 'Tree Pose', difficulty: 'Intermediate', benefits: 'Improves balance, strengthens thighs and ankles, stretches groins and inner thighs', image: tree, duration: 90, instruction: 'Stand on one leg, place opposite foot on inner thigh, and bring palms together at chest.' },
          { id: 5, name: 'Headstand', difficulty: 'Advanced', benefits: 'Strengthens arms and shoulders, calms the brain, improves digestion', image: headstand, duration: 180, instruction: 'Place forearms on mat, interlace fingers, rest crown of head in hands, and lift legs overhead.' },
          { id: 6, name: 'Crow Pose', difficulty: 'Advanced', benefits: 'Strengthens arms and wrists, stretches the upper back, improves balance', image: crow, duration: 120, instruction: 'Squat down, place hands on mat, bend elbows, and balance knees on upper arms while lifting feet.' },
          { id: 7, name: "Child's Pose", difficulty: 'Beginner', benefits: 'Relieves back and neck pain, calms the mind, stretches hips and thighs', image: child, duration: 60, instruction: 'Sit with legs extended forward, reach and hold your feet while keeping your back straight.' },
          { id: 8, name: 'Bridge Pose', difficulty: 'Intermediate', benefits: 'Strengthens back muscles, improves digestion, relieves stress and anxiety', image: bridge, duration: 90, instruction: 'Lie on your back, bend knees, place feet flat, lift hips, and clasp hands beneath your back.' },
          { id: 9, name: 'Cobra Pose', difficulty: 'Beginner', benefits: 'Strengthens the spine, stretches chest and lungs, improves flexibility', image: cobra, duration: 60, instruction: 'Lie on stomach, place palms under shoulders, and lift chest while keeping elbows slightly bent.' }
        ];

        setPoses(mockPoses);
        setFilteredPoses(mockPoses);

        // Load daily challenge from backend
        const challengeResponse = await fetch(`${API_ENDPOINTS.PROGRESS}/daily-challenge/${userName}`);
        if (challengeResponse.ok) {
          const challengeData = await challengeResponse.json();
          setDailyChallengePose({
            ...challengeData.pose,
            image: getPoseImage(challengeData.pose.name)
          });
          if (challengeData.completed) {
            setCompletedDailyPoseName(challengeData.pose.name);
          }
        }

        // Load sequence if in URL
        const sequenceId = searchParams.get('sequenceId');
        if (sequenceId) {
          try {
            const response = await fetch(`${API_ENDPOINTS.SEQUENCES}/${sequenceId}`);
            if (response.ok) {
              const matched = await response.json();
              setCurrentSequence(matched);
              setSequenceIndex(0);
              // Scroll to timer when sequence is loaded from URL
              setTimeout(() => {
                scrollToTimer();
              }, 300); // Reduced delay for faster response
            }
          } catch (error) {
            console.error('Error loading sequence:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userName, searchParams]);

  useEffect(() => {
    if (currentSequence && poses.length > 0) {
      const poseName = currentSequence.poses[sequenceIndex]?.name;
      const matchedPose = poses.find(p => p.name === poseName);
      if (matchedPose) {
        setCurrentPose({
          ...matchedPose,
          duration: currentSequence.poses[sequenceIndex].duration
        });
      }
    }
  }, [currentSequence, poses, sequenceIndex]);

  const handleNextPose = () => {
    if (!currentSequence || sequenceIndex >= currentSequence.poses.length - 1) return false;
    setSequenceIndex(prev => prev + 1);
    return true;
  };

  const updateProgressInDatabase = async (poseName) => {
    try {
      // Update pose history and streak
      const response = await fetch(`${API_ENDPOINTS.PROGRESS}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, poseName })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      setStreak(data.streak);

      // If this was a daily challenge, mark it complete
      if (dailyChallengePose?.name === poseName && completedDailyPoseName !== poseName) {
        const challengeResponse = await fetch(`${API_ENDPOINTS.PROGRESS}/daily-challenge/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: userName, poseName })
        });

        if (challengeResponse.ok) {
          setCompletedDailyPoseName(poseName);
          return true; // Daily challenge was completed
        }
      }
      return false; // Not a daily challenge or already completed
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  const handlePoseComplete = async () => {
    const dailyChallengeCompleted = await updateProgressInDatabase(currentPose.name);

    // Show daily challenge alert first if needed
    if (dailyChallengeCompleted) {
      alert('🎉 Daily Challenge Completed!');
    }

    // Now handle sequence/pose completion
    if (!handleNextPose()) {
      //alert(`🎉 You completed the ${currentSequence?.name || 'pose'}!`);
      setCurrentPose(null);
      setCurrentSequence(null);
      setSequenceIndex(0);
    }
  };

  useEffect(() => {
    let filtered = poses;
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedDifficulty !== 'All') filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    setFilteredPoses(filtered);
  }, [searchTerm, selectedDifficulty, poses]);

  const scrollToTimer = () => {
    setTimeout(() => {
      timerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container loading">
        <div className="loader"></div>
        <p>Loading your yoga dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {userName}!</h1>
          <LastLogin userName={userName} />
        </div>
        <StreakCounter streak={streak} />
        <ProgressTracker userName={userName} />
      </div>

      <DailyChallenge
        poses={poses}
        userName={userName}
        onComplete={(poseName) => {
          setStreak(prev => prev + 1);
          setCompletedDailyPoseName(poseName);
        }}
        onTakeChallenge={(pose) => {
          setCurrentPose(pose);
          scrollToTimer();
        }}
        completedPoseName={completedDailyPoseName}
      />

      <MoodSuggester poses={poses} />

      {currentSequence && (
        <div className="sequence-progress">
          <div className="sequence-header">
            <h3>{currentSequence.name}</h3>
            <span>{Math.round((sequenceIndex / currentSequence.poses.length) * 100)}% Complete</span>
          </div>
          <div className="progress-bar">
            {currentSequence.poses.map((_, i) => (
              <div key={i} className={`progress-step ${i < sequenceIndex ? 'completed' : ''} ${i === sequenceIndex ? 'current' : ''}`} />
            ))}
          </div>
          <div className="pose-info">
            <div className="current-pose"><strong>Current:</strong> {currentPose?.name}</div>
            {currentSequence.poses[sequenceIndex + 1] && (
              <div className="next-pose"><strong>Next:</strong> {currentSequence.poses[sequenceIndex + 1].name}</div>
            )}
          </div>
          <div className="sequence-controls">
            <button onClick={() => setIsSequencePaused(p => !p)} className={isSequencePaused ? 'resume-button' : 'pause-button'}>
              {isSequencePaused ? 'Resume Sequence' : 'Pause Sequence'}
            </button>
            <button onClick={handleNextPose} className="skip-button" disabled={sequenceIndex >= currentSequence.poses.length - 1}>
              Skip to Next
            </button>
            <button onClick={() => {
              setCurrentPose(null);
              setCurrentSequence(null);
              setSequenceIndex(0);
              setIsSequencePaused(false);
            }} className="cancel-button">
              Cancel Sequence
            </button>
          </div>
        </div>
      )}

      {!currentPose && (
        <div className="dashboard-tools">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <DifficultyFilter selectedDifficulty={selectedDifficulty} setSelectedDifficulty={setSelectedDifficulty} />
        </div>
      )}

      {currentPose ? (
        <div ref={timerRef} className="pose-timer-container">
          <PoseTimer
            pose={currentPose}
            onComplete={handlePoseComplete}
            onCancel={() => {
              setCurrentPose(null);
              setCurrentSequence(null);
              setSequenceIndex(0);
              setIsSequencePaused(false);
            }}
            isPaused={isSequencePaused}
            onTogglePause={() => setIsSequencePaused(p => !p)}
            isMusicEnabled={isMusicEnabled}
            toggleMusic={() => setIsMusicEnabled(p => !p)}
          />
        </div>
      ) : (
        <div className="poses-grid">
          {filteredPoses.map(p => (
            <PoseCard key={p.id} pose={p} onClick={() => setCurrentPose(p)} />
          ))}
        </div>
      )}

      <ChatBot poses={poses} />
      <MusicPlayer isPlaying={!!currentPose && isMusicEnabled} />
    </div>
  );
};

export default Dashboard;