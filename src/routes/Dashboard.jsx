import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import WeatherChart from '../components/WeatherChart';

const Dashboard = ({ 
  weatherData, 
  loading, 
  error, 
  filters, 
  setFilters, 
  searchQuery, 
  setSearchQuery, 
  saveScrollPosition, 
  restoreScrollPosition 
}) => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!hasScrolled) {
      restoreScrollPosition();
      setHasScrolled(true);
    }
  }, [restoreScrollPosition, hasScrolled]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return weatherData.filter((data) => {
      const matchesSearch = data.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemp = data.main.temp >= filters.tempRange[0] && 
                         data.main.temp <= filters.tempRange[1];
      const matchesWind = data.wind.speed >= filters.windSpeed;
      const matchesConditions = filters.conditions.length === 0 || 
                               filters.conditions.some(condition => 
                                 data.weather.some(w => w.main === condition));

      return matchesSearch && matchesTemp && matchesWind && matchesConditions;
    });
  }, [weatherData, searchQuery, filters]);

  // Prepare data for charts
  const limitedDataForChart = useMemo(() => {
    return filteredData.slice(0, 10).map(item => ({
      ...item,
      forecast: item.forecast || [] // Ensure forecast exists
    }));
  }, [filteredData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const temps = filteredData.map(data => data.main.temp);
    return {
      avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length || 0,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      totalLocations: filteredData.length
    };
  }, [filteredData]);

  const handleCityClick = (id) => {
    saveScrollPosition();
    navigate(`/location/${id}`);
  };

  return (
    <div className="container" ref={containerRef}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
      />

      <div className="filters">
        <div className="filter-group">
          <label>
            Temperature Range: {filters.tempRange[0]}°C to {filters.tempRange[1]}°C
          </label>
          <div className="range-inputs">
            <input
              type="range"
              min="-20"
              max="50"
              value={filters.tempRange[0]}
              onChange={(e) => setFilters({
                ...filters,
                tempRange: [Number(e.target.value), filters.tempRange[1]]
              })}
            />
            <input
              type="range"
              min="-20"
              max="50"
              value={filters.tempRange[1]}
              onChange={(e) => setFilters({
                ...filters,
                tempRange: [filters.tempRange[0], Number(e.target.value)]
              })}
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
            onChange={(e) => setFilters({
              ...filters,
              windSpeed: Number(e.target.value)
            })}
          />
        </div>

        <div className="filter-group">
          <label>Weather Conditions:</label>
          <div className="condition-checkboxes">
            {['Clear', 'Clouds', 'Rain', 'Snow'].map((condition) => (
              <label key={condition} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(condition)}
                  onChange={() => setFilters({
                    ...filters,
                    conditions: filters.conditions.includes(condition)
                      ? filters.conditions.filter(c => c !== condition)
                      : [...filters.conditions, condition]
                  })}
                />
                <span className="checkmark"></span>
                {condition}
              </label>
            ))}
          </div>
        </div>
      </div>

      {limitedDataForChart.length > 0 && (
        <WeatherChart weatherData={limitedDataForChart} />
      )}

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
        {filteredData.slice(0, 30).map((data) => (
          <WeatherCard
            key={data.id}
            weather={data}
            onClick={() => handleCityClick(data.id)}
          />
        ))}

        {filteredData.length === 0 && !loading && (
          <div className="error-banner">
            No locations found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  weatherData: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  filters: PropTypes.shape({
    tempRange: PropTypes.arrayOf(PropTypes.number),
    windSpeed: PropTypes.number,
    conditions: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  saveScrollPosition: PropTypes.func.isRequired,
  restoreScrollPosition: PropTypes.func.isRequired
};

export default Dashboard;