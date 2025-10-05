import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginSignup.css';
import logo from '../assets/images/logo.jpg';
import API_ENDPOINTS from '../config/api';

const Signup = ({ setIsLoggedIn, setUserName }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    console.log('Attempting to sign up user:', { email, username });
    
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      
      console.log('Signup response status:', response.status);
      
      const data = await response.json();
      console.log('Signup response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      console.log('Signup successful, navigating to dashboard');
      setIsLoggedIn(true);
      setUserName(data.username);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Welcome to YogShala</h1>
        <img src={logo} alt="YogShala Logo" className="logo" />
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Choose a username" 
              required
              minLength="3"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Create a password (min 6 characters)" 
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm your password" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;