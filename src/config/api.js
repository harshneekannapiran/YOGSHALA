// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/users/login`,
  SIGNUP: `${API_BASE_URL}/users/signup`,
  
  // Pose endpoints
  POSES: `${API_BASE_URL}/poses`,
  
  // Sequence endpoints
  SEQUENCES: `${API_BASE_URL}/sequences`,
  
  // Progress endpoints
  PROGRESS: `${API_BASE_URL}/progress`,
};

export default API_ENDPOINTS;

