import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/api';

const LastLogin = ({ userName }) => {
  const [lastLogin, setLastLogin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastLogin = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching last login for user:', userName);
        
        const response = await fetch(`${API_ENDPOINTS.LOGIN.replace('/login', '')}/last-login/${userName}`);
        console.log('Last login response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Last login data received:', data);
        
        if (data.lastLogin) {
          setLastLogin(new Date(data.lastLogin));
        }
      } catch (error) {
        console.error('Error fetching last login:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userName) {
      fetchLastLogin();
    }
  }, [userName]);

  const formatLastLogin = (date) => {
    if (!date) return 'Never';
    
    // Always show full date and time
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  return (
    <p style={{ 
      color: '#777', 
      fontSize: '0.9rem', 
      margin: '0.5rem 0 0 0',
      fontStyle: 'italic'
    }}>
      Last login: {formatLastLogin(lastLogin)}
    </p>
  );
};

export default LastLogin; 