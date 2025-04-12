import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './routes/Dashboard';
import DetailView from './routes/DetailView';
import Navigation from './routes/Navigation';
import './styles/App.css';
import { createClient } from 'pexels';
import { 
  validateImprovedHumidity, 
  validateWindSpeed, 
  fetchApiQuirks, 
  fetchHumidityThresholds 
} from "./utils/weatherValidations";
import ErrorBoundary from './ErrorBoundary';

const pexelsClient = createClient(import.meta.env.VITE_APP_PEXELS_KEY);

const DEFAULT_LOCATIONS = [
  'London,UK', 'New York,US', 'Tokyo,JP', 
  'Paris,FR', 'Sydney,AU', 'Dubai,AE',
  'Mumbai,IN', 'Berlin,DE', 'Toronto,CA'
];

const App = () => {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    tempRange: [-20, 50],
    windSpeed: 0,
    conditions: []
  });
  const [scrollPosition, setScrollPosition] = useState(0);

  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };

  const restoreScrollPosition = () => {
    window.scrollTo(0, scrollPosition);
  };

  const fetchBackgroundImage = async (cityName) => {
    try {
      const pexelsRes = await fetch(
        `https://api.pexels.com/v1/search?query=${cityName}+city&per_page=1`,
        { headers: { Authorization: import.meta.env.VITE_APP_PEXELS_KEY } }
      );
      const pexelsData = await pexelsRes.json();
      if (pexelsData.photos?.length > 0) return pexelsData.photos[0].src.large2x;

      const unsplashRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${cityName}+city&per_page=1`,
        { headers: { Authorization: `Client-ID ${import.meta.env.VITE_APP_UNSPLASH_KEY}` } }
      );
      const unsplashData = await unsplashRes.json();
      if (unsplashData.results?.length > 0) return unsplashData.results[0].urls.regular;

      return 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
    } catch (err) {
      console.error('Error fetching background:', err);
      return 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
    }
  };

  const fetchWeather = async (query) => {
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${import.meta.env.VITE_APP_OWM_KEY}`
      );
      const [geoData] = await geoRes.json();
      if (!geoData) return null;

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${import.meta.env.VITE_APP_OWM_KEY}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${geoData.lat}&lon=${geoData.lon}&units=metric&appid=${import.meta.env.VITE_APP_OWM_KEY}`
      );

      const current = await weatherRes.json();
      const forecast = await forecastRes.json();

      return {
        ...current,
        forecast: forecast.list,
        id: geoData.lat + geoData.lon
      };
    } catch (err) {
      console.error('Error fetching weather:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllWeather = async () => {
      try {
        setLoading(true);
        const results = await Promise.all(
          locations.slice(0, 30).map(location => fetchWeather(location))
        );
        setWeatherData(results.filter(Boolean));
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllWeather();
  }, [locations]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await fetchApiQuirks();
        await fetchHumidityThresholds();
      } catch (err) {
        setError('Failed to initialize data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={
              <Dashboard 
                weatherData={weatherData}
                loading={loading}
                error={error}
                filters={filters}
                setFilters={setFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                saveScrollPosition={saveScrollPosition}
                restoreScrollPosition={restoreScrollPosition}
              />
            } />
            <Route path="/location/:id" element={
              <DetailView 
                weatherData={weatherData}
                fetchBackgroundImage={fetchBackgroundImage}
                saveScrollPosition={saveScrollPosition}
                restoreScrollPosition={restoreScrollPosition}
              />
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;