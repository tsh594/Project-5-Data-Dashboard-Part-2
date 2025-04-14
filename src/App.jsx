import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './Dashboard';
import CityDetail from './CityDetail';
import NavBar from './NavBar';
import TemperatureChart from './components/TemperatureChart';
import TemperatureLineChart from './components/TemperatureLineChart';
import HumidityChart from './components/HumidityChart';
import './App.css';

const App = () => {
  const [bgStyle, setBgStyle] = useState({ 
    backgroundImage: "url('/nature1.jpg')" 
  });

  // Generate sample data that works for both chart types
  const generateSampleForecastData = () => {
    const now = Math.floor(Date.now() / 1000);
    const hours = 24;
    const data = [];
    
    for (let i = 0; i < hours; i++) {
      const temp = 15 + Math.sin(i * Math.PI / 12) * 10; // Creates a wave pattern
      data.push({
        dt: now + (i * 3600), // Add one hour each iteration
        main: {
          temp: temp,
          feels_like: temp + (Math.random() * 2 - 1), // Random slight variation
          humidity: 40 + Math.sin(i * Math.PI / 6) * 30 // Humidity wave pattern
        },
        weather: [{
          main: i % 3 === 0 ? 'Clear' : i % 3 === 1 ? 'Clouds' : 'Rain'
        }]
      });
    }
    return data;
  };

  const sampleForecastData = generateSampleForecastData();

  return (
    <div className="app" style={bgStyle}>
      <NavBar />
      <div className="chart-router-container">
        <Routes>
          <Route path="/" element={<Dashboard setBgStyle={setBgStyle} />} />
          <Route path="/city/:cityId" element={<CityDetail setBgStyle={setBgStyle} />} />
          
          {/* Bar Chart Version */}
          <Route path="/temperature-bar" element={
            <div className="chart-page-container">
              <h2>24-Hour Temperature (Bar Chart)</h2>
              <TemperatureChart forecastData={sampleForecastData} />
            </div>
          } />
          
          {/* Line Chart Version */}
          <Route 
            path="/temperature-line" 
            element={
              <div style={{ padding: '20px' }}>
                <TemperatureLineChart forecastData={sampleForecastData} />
              </div>
            } 
          />
          
          <Route path="/humidity" element={
            <div className="chart-page-container">
              <h2>Humidity Levels</h2>
              <HumidityChart data={sampleForecastData} />
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default App;