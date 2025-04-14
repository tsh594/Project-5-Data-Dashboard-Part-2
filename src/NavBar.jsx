import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMap, FiGithub, FiX, FiMenu } from 'react-icons/fi';
import './App.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <button
        className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      />
      
      <nav className={`nav-sidebar ${isMenuOpen ? 'active' : ''}`}>
        <div className="nav-header">
          <h2 className="nav-title">Weather Dashboard</h2>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-item" onClick={closeMenu}>
            <FiHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Link>
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-item"
            onClick={closeMenu}
          >
            <FiMap className="nav-icon" />
            <span className="nav-text">Weather Map</span>
          </a>
          <a
            href="https://github.com/tsh594/Project-5-Data-Dashboard-Part-2.git"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item"
            onClick={closeMenu}
          >
            <FiGithub className="nav-icon" />
            <span className="nav-text">GitHub Repo</span>
          </a>
        </div>
        <div className="nav-footer">
          <p className="nav-copyright">
            © {new Date().getFullYear()} Weather Dashboard
          </p>
        </div>
      </nav>
    </>
  );
};

export default NavBar;