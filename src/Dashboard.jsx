import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherCard from './components/WeatherCard';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';


const DEFAULT_LOCATIONS = [
  'London,UK', 'New York,US', 'Tokyo,JP', 
  'Paris,FR', 'Sydney,AU', 'Dubai,AE',
  'Mumbai,IN', 'Berlin,DE', 'Toronto,CA',
  'São Paulo,BR', 'Los Angeles,US', 'Shanghai,CN',
  'Chicago,US', 'Singapore,SG', 'Hong Kong,CN',
  'Seoul,KR', 'Moscow,RU', 'Istanbul,TR',
  'Mexico City,MX', 'Cairo,EG', 'Bangkok,TH',
  'Jakarta,ID', 'Osaka,JP', 'Melbourne,AU',
  'Vancouver,CA'
];


// Add these styles to your existing App.css
const chartStyles = `
.chart-container {
  background: rgba(46, 4, 89, 0.3);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  border: 1px solid rgba(224, 170, 255, 0.1);
}

.chart-container h3 {
  color: #9D70FF;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.2rem;
}

/* Replace the existing .charts-grid with */
.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin-top: 2rem;
}

/* Add media query for larger screens */
@media (min-width: 1200px) {
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
`;

// Add to your existing Dashboard component
const Dashboard = ({ setBgStyle }) => {
  // Add this useEffect at the top of the component
  useEffect(() => {
    // Set default background when dashboard mounts
    setBgStyle({ backgroundImage: "url('/nature1.jpg')" });
    
    // Cleanup to prevent memory leaks
    return () => {
      setBgStyle({ backgroundImage: "url('/nature1.jpg')" });
    };
  }, [setBgStyle]);

  // Rest of the component remains the same...
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [weatherData, setWeatherData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tempRange: [-20, 50],
    windSpeed: 0,
    conditions: []
  });

  const navigate = useNavigate();
  const apiCooldown = useRef(false);
  const suggestionsRef = useRef(null);
  const OWM_KEY = import.meta.env.VITE_APP_OWM_KEY;

  useEffect(() => {
    const fetchAllWeather = async () => {
      try {
        setLoading(true);
        const promises = locations.map(async (location) => {
          const [city, country] = location.split(',');
          return await fetchWeather(`${city},${country}`);
        });
        
        const results = await Promise.all(promises);
        setWeatherData(results.filter(Boolean));
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllWeather();
  }, [locations]);

  const fetchWeather = async (query) => {
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${OWM_KEY}`
      );
      if (!geoRes.ok) throw new Error('Geocoding API error');
      
      const [geoData] = await geoRes.json();
      if (!geoData) return null;
      
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${OWM_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${OWM_KEY}`)
      ]);
      
      if (!weatherRes.ok || !forecastRes.ok) throw new Error('Weather API error');
      
      const [weatherData, forecastData] = await Promise.all([
        weatherRes.json(),
        forecastRes.json()
      ]);
      
      return {
        ...weatherData,
        coordinates: geoData,
        forecast: forecastData.list
      };
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message);
      return null;
    }
  };

  const filteredData = weatherData.filter(data => {
    const matchesSearch = data.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemp = data.main.temp >= filters.tempRange[0] && 
                       data.main.temp <= filters.tempRange[1];
    const matchesWind = data.wind.speed >= filters.windSpeed;
    const matchesConditions = filters.conditions.length === 0 || 
                             filters.conditions.includes(data.weather[0].main);
    
    return matchesSearch && matchesTemp && matchesWind && matchesConditions;
  });

  const stats = {
    avgTemp: filteredData.reduce((sum, data) => sum + data.main.temp, 0) / filteredData.length || 0,
    minTemp: Math.min(...filteredData.map(data => data.main.temp)),
    maxTemp: Math.max(...filteredData.map(data => data.main.temp)),
    totalLocations: filteredData.length
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${OWM_KEY}`
        );
        const data = await res.json();
        setSuggestions(data.map(({ name, state, country }) => 
          `${name}${state ? `, ${state}` : ''}, ${country}`));
      } catch (err) {
        console.error('Suggestions error:', err);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setInputValue(suggestion);
    setSuggestions([]);
  };

  // Define chartData
  const chartData = [
    { name: '12 PM', temp: 25, feels_like: 27 },
    { name: '1 PM', temp: 26, feels_like: 28 },
    { name: '2 PM', temp: 27, feels_like: 29 },
    { name: '3 PM', temp: 28, feels_like: 30 },
    { name: '4 PM', temp: 29, feels_like: 31 },
    { name: '5 PM', temp: 30, feels_like: 32 },
    { name: '6 PM', temp: 31, feels_like: 33 },
    { name: '7 PM', temp: 32, feels_like: 34 },
    { name: '8 PM', temp: 33, feels_like: 35 },
    { name: '9 PM', temp: 34, feels_like: 36 },
  ];

  return (
    <>
     <style>{chartStyles}</style>
      <div className="search-container">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="glow-input"
          />
          <button 
            type="submit"
            className="search-btn"
            disabled={loading || !inputValue.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown" ref={suggestionsRef}>
            {suggestions.map((suggestion, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Temperature Range: {filters.tempRange[0]}°C to {filters.tempRange[1]}°C</label>
          <div className="range-inputs">
            <input
              type="range"
              min="-20"
              max="50"
              value={filters.tempRange[0]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tempRange: [Number(e.target.value), filters.tempRange[1]],
                })
              }
            />
            <input
              type="range"
              min="-20"
              max="50"
              value={filters.tempRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tempRange: [filters.tempRange[0], Number(e.target.value)],
                })
              }
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Wind Speed: ≥ {filters.windSpeed} m/s</label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={filters.windSpeed}
            onChange={(e) =>
              setFilters({ ...filters, windSpeed: Number(e.target.value) })
            }
          />
        </div>

        <div className="filter-group">
          <label>Weather Conditions:</label>
          <div className="condition-checkboxes">
            {["Clear", "Clouds", "Rain", "Snow"].map((condition) => (
              <label key={condition} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(condition)}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      conditions: filters.conditions.includes(condition)
                        ? filters.conditions.filter((c) => c !== condition)
                        : [...filters.conditions, condition],
                    })
                  }
                />
                <span className="checkmark"></span>
                {condition}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <TemperatureChart
          data={filteredData.slice(0, 10).map((data) => ({
            name: data.name, // Use city name as the label
            temp: data.main.temp, // Actual temperature
            feels_like: data.main.feels_like, // Feels-like temperature
          }))}
        />
        <HumidityChart
          data={filteredData.slice(0, 10).map((data) => ({
            name: data.name, // Use city name as the label
            humidity: data.main.humidity, // Humidity percentage
          }))}
        />
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Avg Temp</h3>
          <p>{stats.avgTemp.toFixed(1)}°C</p>
        </div>
        <div className="stat-card">
          <h3>Min Temp</h3>
          <p>{stats.minTemp}°C</p>
        </div>
        <div className="stat-card">
          <h3>Max Temp</h3>
          <p>{stats.maxTemp}°C</p>
        </div>
        <div className="stat-card">
          <h3>Locations</h3>
          <p>{stats.totalLocations}</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="locations-list">
        {filteredData.length === 0 && !loading && (
          <div className="error-banner">No locations found matching your criteria</div>
        )}
        
        {filteredData.slice(0, 25).map(data => (
          <WeatherCard 
            key={data.id}
            weather={data}
            onClick={() => navigate(`/city/${data.id}`)}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;