import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navigation">
      <h1>Weather App</h1>
      <div className="sidebar-header">
        <h2>Global Weather</h2>
        <p>Explore weather around the world</p>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              isActive ? 'active-link' : ''
            }
            title="Go to the Dashboard"
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            API Docs
          </a>
        </li>
        <li>
          <a 
            href="https://github.com/tsh594/Project-5-Data-Dashboard-Part-2.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;