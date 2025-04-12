import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import CityDetail from './CityDetail';
import './App.css';
import NavBar from './NavBar';

const App = () => {
  const [bgStyle, setBgStyle] = useState({ 
    backgroundImage: "url('/nature1.jpg')" 
  });

  return (
    <div className="app" style={bgStyle}>
      <NavBar />
      <div className="container" style={{ paddingLeft: '100px' }}>
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard setBgStyle={setBgStyle} />} 
          />
          <Route 
            path="/city/:cityId" 
            element={<CityDetail setBgStyle={setBgStyle} />} 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;