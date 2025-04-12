import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WeatherChart from '../components/WeatherChart';
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThermometer, 
         WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import { DateTime } from 'luxon';

const DetailView = ({ weatherData, fetchBackgroundImage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weatherData.length > 0) {
      const foundLocation = weatherData.find((item) => item.id === parseFloat(id));
      setLocation(foundLocation);
    }
  }, [id, weatherData]);

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetchBackgroundImage(location.name)
        .then((image) => {
          setBackgroundImage(image);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching background image:', err);
          setBackgroundImage('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5');
          setLoading(false);
        });
    }
  }, [location, fetchBackgroundImage]);

  const formatTime = (timestamp, timezoneOffset) => {
    return DateTime.fromSeconds(timestamp, { zone: 'utc' })
      .plus({ seconds: timezoneOffset })
      .toLocaleString(DateTime.TIME_SIMPLE);
  };

  const getWeatherIcon = (main) => {
    const iconSize = 60;
    const iconMap = {
      clear: <WiDaySunny size={iconSize} className="sunny" />,
      rain: <WiRain size={iconSize} className="rain" />,
      snow: <WiSnow size={iconSize} className="snow" />,
      clouds: <WiCloudy size={iconSize} className="cloudy" />,
      thunderstorm: <WiRain size={iconSize} className="thunder" />,
      drizzle: <WiRain size={iconSize} className="drizzle" />,
      mist: <WiCloudy size={iconSize} className="mist" />,
    };
    return iconMap[main.toLowerCase()] || iconMap.clear;
  };

  if (!weatherData.length) {
    return (
      <div className="container">
        <div className="loading-banner">Loading weather data...</div>
        <button className="back-button" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container">
        <div className="error-banner">Location not found.</div>
        <button className="back-button" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="detail-view">
      <div className="hero-image">
        <img src={backgroundImage} alt={`${location.name} cityscape`} />
      </div>
      
      <div className="weather-content">
        <div className="location-header">
          <h1>{location.name}, {location.sys.country}</h1>
          <div className="current-weather">
            <div className="weather-icon">
              {getWeatherIcon(location.weather[0].main)}
              <span>{location.weather[0].description}</span>
            </div>
            <div className="temperature-display">
              <span className="temperature">{Math.round(location.main.temp)}°C</span>
              <div className="feels-like">
                <WiThermometer />
                <span>Feels like {Math.round(location.main.feels_like)}°C</span>
              </div>
            </div>
          </div>
        </div>

        <div className="weather-stats">
          <div className="stat-item">
            <WiHumidity />
            <span>Humidity: {location.main.humidity}%</span>
          </div>
          <div className="stat-item">
            <WiStrongWind />
            <span>Wind: {location.wind.speed} m/s</span>
          </div>
          <div className="stat-item">
            <WiSunrise />
            <span>Sunrise: {formatTime(location.sys.sunrise, location.timezone)}</span>
          </div>
          <div className="stat-item">
            <WiSunset />
            <span>Sunset: {formatTime(location.sys.sunset, location.timezone)}</span>
          </div>
        </div>

        <div className="forecast-section">
          <h2>24-Hour Forecast</h2>
          <WeatherChart weatherData={[location]} detailedView />
        </div>

        <div className="forecast-section">
          <h2>5-Day Forecast</h2>
          <div className="daily-forecast">
            {location.forecast && location.forecast
              .filter((_, index) => index % 8 === 0)
              .slice(0, 5)
              .map((day, index) => (
                <div key={index} className="day-card">
                  <h3>
                    {DateTime.fromSeconds(day.dt, { zone: 'utc' })
                      .plus({ seconds: location.timezone })
                      .toFormat('EEE')}
                  </h3>
                  <div className="weather-icon-small">
                    {getWeatherIcon(day.weather[0].main)}
                  </div>
                  <div className="temps">
                    <span className="high">{Math.round(day.main.temp_max)}°</span>
                    <span className="low">{Math.round(day.main.temp_min)}°</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <button className="back-button" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DetailView;