import { Link } from 'react-router-dom';
import { FiHome, FiMap, FiGithub } from 'react-icons/fi';
import './NavBar.css'; // Create new CSS file

const NavBar = () => {
  return (
    <nav className="nav-sidebar">
      <div className="nav-links">
        <Link to="/" className="nav-item">
          <FiHome className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </Link>
        
        <a 
          href="https://openweathermap.org/api" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-item"
        >
          <FiMap className="nav-icon" />
          <span className="nav-text">Weather Map</span>
        </a>

        <a
          href="https://github.com/tsh594/Project-5-Data-Dashboard-Part-2.git"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
        >
          <FiGithub className="nav-icon" />
          <span className="nav-text">GitHub</span>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;