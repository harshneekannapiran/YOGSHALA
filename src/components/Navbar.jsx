import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/images/logo.jpg';

const Navbar = ({ userName, setIsLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="YogShala Logo" className="logo" />
        <h1>YogShala</h1>
      </div>
      <div className="navbar-links">
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/sequences')}>My Sequences</button>
      </div>
      <div className="navbar-user">
        <button onClick={() => { setIsLoggedIn(false); navigate('/login'); }} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;