import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Sequences from './pages/Sequences';
import Navbar from './components/Navbar';
import './App.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar userName={userName} setIsLoggedIn={setIsLoggedIn} />}
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} 
          />
          <Route 
            path="/signup" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <SignUp setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? 
              <Dashboard userName={userName} /> : 
              <Navigate to="/login" />} 
          />
          <Route 
            path="/sequences" 
            element={
              isLoggedIn ? 
              <Sequences userName={userName} /> : 
              <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <Navigate to="/login" />} 
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;