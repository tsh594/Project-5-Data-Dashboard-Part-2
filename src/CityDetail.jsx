import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset
} from 'react-icons/wi';
import { DateTime } from 'luxon';
import Forecast from './components/Forecast';
import './App.css';
import TemperatureLineChart from './components/TemperatureLineChart';

const CityDetail = ({ setBgStyle }) => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const PEXELS_KEY = import.meta.env.VITE_APP_PEXELS_KEY;

  // Check for dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const fetchCityBackground = async (cityName) => {
    try {
      const pexelsRes = await fetch(
        `https://api.pexels.com/v1/search?query=${cityName}+skyline&orientation=landscape&per_page=1`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      if (!pexelsRes.ok) throw new Error('Pexels API error');
      
      const pexelsData = await pexelsRes.json();
      if (pexelsData.photos?.length > 0) {
        return pexelsData.photos[0].src.large2x;
      }

      const unsplashRes = await fetch(
        `https://api.unsplash.com/photos/random?query=${cityName}&client_id=${import.meta.env.VITE_APP_UNSPLASH_KEY}`
      );
      if (!unsplashRes.ok) throw new Error('Unsplash API error');
      
      const unsplashData = await unsplashRes.json();
      return unsplashData.urls?.regular || '/nature1.jpg';

    } catch (err) {
      console.error('Background fetch error:', err);
      return '/nature1.jpg';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${import.meta.env.VITE_APP_OWM_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${import.meta.env.VITE_APP_OWM_KEY}`)
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const [weatherData, forecastData] = await Promise.all([
          weatherRes.json(),
          forecastRes.json()
        ]);

        if (!weatherData?.name || !forecastData?.list) {
          throw new Error('Invalid data format from API');
        }

        const bgImage = await fetchCityBackground(weatherData.name);
        setBgStyle({
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`
        });

        setData({
          ...weatherData,
          forecast: forecastData.list
        });
      } catch (err) {
        setError(err.message);
        setBgStyle({ backgroundImage: "url('/nature1.jpg')" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setBgStyle({ backgroundImage: "url('/nature1.jpg')" });
    };
  }, [cityId, setBgStyle]);

  const formatTime = (timestamp) => {
    if (!data?.timezone) return '--:--';
    return DateTime.fromSeconds(timestamp)
      .setZone(`UTC${data.timezone >= 0 ? '+' : ''}${data.timezone/3600}`)
      .toFormat('h:mm a');
  };

  if (loading) return (
    <div className={`loading-spinner ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="spinner"></div>
    </div>
  );
  
  if (error) return (
    <div className={`error-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="error-banner">{error}</div>
      <button className="close-btn" onClick={() => navigate('/')}>
        Back to List
      </button>
    </div>
  );
  
  if (!data) return <div className={`no-data ${isDarkMode ? 'dark' : 'light'}`}>No weather data available</div>;

  return (
    <div className={`weather-content ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="city-header glass-card">
        <h1 className="city-name">
          {data.name}
          <span className="country-badge">{data.sys?.country}</span>
        </h1>
        <div className="coordinates">
          <span>Lat: {data.coord?.lat?.toFixed(2)}°N</span>
          <span>Lon: {data.coord?.lon?.toFixed(2)}°E</span>
        </div>
      </div>

      <div className="current-weather glass-card">
        <div className="weather-main">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0]?.icon}@4x.png`}
            alt={data.weather[0]?.description || 'Weather icon'}
            className="weather-icon"
          />
          <div className="temperature-display">
            <span className="main-temp">{Math.round(data.main?.temp)}°C</span>
            <div className="feels-like">
              <WiThermometer className="icon-spin" />
              Feels like {Math.round(data.main?.feels_like)}°C
            </div>
          </div>
        </div>
      </div>

      <div className="weather-stats-grid">
        <div className="stat-item glass-card">
          <WiHumidity className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{data.main?.humidity}%</span>
          </div>
        </div>
        <div className="stat-item glass-card">
          <WiStrongWind className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Wind</span>
            <span className="stat-value">{data.wind?.speed} m/s</span>
          </div>
        </div>
        <div className="stat-item glass-card">
          <WiSunrise className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Sunrise</span>
            <span className="stat-value">{formatTime(data.sys?.sunrise)}</span>
          </div>
        </div>
        <div className="stat-item glass-card">
          <WiSunset className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Sunset</span>
            <span className="stat-value">{formatTime(data.sys?.sunset)}</span>
          </div>
        </div>
      </div>

      <div className="chart-container glass-card">
        <TemperatureLineChart forecastData={data.forecast} darkMode={isDarkMode} />
      </div>

      {data.forecast && (
        <Forecast forecast={{
          hourly: data.forecast.slice(0, 8),
          daily: data.forecast.filter((_, i) => i % 8 === 0)
        }} darkMode={isDarkMode} />
      )}

      <button 
        className="close-btn"
        onClick={() => navigate('/')}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default CityDetail;