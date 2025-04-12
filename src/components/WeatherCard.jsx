import { DateTime } from 'luxon';
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThermometer, 
         WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import PropTypes from 'prop-types';

const WeatherCard = ({ weather, onClick }) => {
  if (!weather || !weather.sys || !weather.weather) {
    return (
      <div className="weather-card error">
        <p>Weather data unavailable</p>
      </div>
    );
  }

  // Get weather icon based on conditions
  const getWeatherIcon = (main) => {
    const iconSize = 80;
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

  // Format time with timezone offset
  const formatTime = (timestamp, timezoneOffset) => {
    try {
      return DateTime.fromSeconds(timestamp, { zone: 'utc' })
        .plus({ seconds: timezoneOffset })
        .toLocaleString(DateTime.TIME_SIMPLE);
    } catch (error) {
      console.error('Time formatting error:', error);
      return '--:--';
    }
  };

  // Calculate daylight duration between sunrise and sunset
  const calculateDaylight = (sunrise, sunset, timezoneOffset) => {
    try {
      const start = DateTime.fromSeconds(sunrise, { zone: 'utc' })
        .plus({ seconds: timezoneOffset });
      const end = DateTime.fromSeconds(sunset, { zone: 'utc' })
        .plus({ seconds: timezoneOffset });
      
      const duration = end.diff(start, ['hours', 'minutes']);
      return `${duration.hours}h ${Math.round(duration.minutes)}m`;
    } catch (error) {
      console.error('Daylight calculation error:', error);
      return '--:--';
    }
  };

  // Destructure weather data with fallbacks
  const {
    name = 'Unknown',
    sys: { country = '', sunrise = 0, sunset = 0 } = {},
    main: { temp = 0, feels_like = 0, humidity = 0 } = {},
    wind: { speed = 0 } = {},
    weather: [primaryWeather = { main: 'Clear' }] = {},
    coord: { lat, lon } = {},
    timezone = 0 // Default to UTC if not provided
  } = weather;

  const windSpeed = typeof speed === 'number' ? speed : 0;

  return (
    <div className="weather-card" onClick={onClick}>
      <div className="location-info">
        <h2>{name}</h2>
        <div className="location-details">
          <span>{country}</span>
          <span>Lat: {lat?.toFixed(2) || '--'}</span>
          <span>Lon: {lon?.toFixed(2) || '--'}</span>
        </div>
      </div>

      <div className="weather-display">
        <div className="weather-icon">
          {getWeatherIcon(primaryWeather.main)}
        </div>
        <div className="temperature-data">
          <span className="temperature">{Math.round(temp)}°C</span>
          <div className="feels-like">
            <WiThermometer className="thermometer-icon" />
            <span>Feels like {Math.round(feels_like)}°C</span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <WiHumidity className="detail-icon" />
          <div className="detail-text">
            <span>Humidity</span>
            <span>{humidity}%</span>
          </div>
        </div>
        
        <div className="detail-item">
          <WiStrongWind className="detail-icon" />
          <div className="detail-text">
            <span>Wind</span>
            <span>{windSpeed.toFixed(1)} m/s</span>
          </div>
        </div>
        
        <div className="detail-item">
          <WiSunrise className="detail-icon" />
          <div className="detail-text">
            <span>Sunrise</span>
            <span>{formatTime(sunrise, timezone)}</span>
          </div>
        </div>
        
        <div className="detail-item">
          <WiSunset className="detail-icon" />
          <div className="detail-text">
            <span>Sunset</span>
            <span>{formatTime(sunset, timezone)}</span>
          </div>
        </div>

        <div className="detail-item">
          <WiSunrise className="daylight-icon" />
          <div className="detail-text">
            <span>Daylight</span>
            <span>{calculateDaylight(sunrise, sunset, timezone)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    name: PropTypes.string,
    sys: PropTypes.shape({
      country: PropTypes.string,
      sunrise: PropTypes.number,
      sunset: PropTypes.number,
    }),
    coord: PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
    }),
    main: PropTypes.shape({
      temp: PropTypes.number,
      feels_like: PropTypes.number,
      humidity: PropTypes.number,
    }),
    wind: PropTypes.shape({
      speed: PropTypes.number,
    }),
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        main: PropTypes.string,
      })
    ),
    timezone: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
};

export default WeatherCard;