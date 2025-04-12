import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiDayCloudyHigh } from 'react-icons/wi';

const Forecast = ({ forecast }) => {
  const getWeatherIcon = (description) => {
    const iconSize = 40;
    if (description.includes('rain')) 
      return <WiRain size={iconSize} className="forecast-icon-rain" />;
    if (description.includes('snow')) 
      return <WiSnow size={iconSize} className="forecast-icon-snow" />;
    if (description.includes('cloud')) 
      return description.includes('few clouds') ? 
        <WiDayCloudyHigh size={iconSize} className="forecast-icon-partly-cloudy" /> :
        <WiCloudy size={iconSize} className="forecast-icon-cloudy" />;
    return <WiDaySunny size={iconSize} className="forecast-icon-sunny" />;
  };

  return (
    <div className="forecast-container">
      <div className="forecast-section">
        <h3>Hourly Forecast</h3>
        <div className="hourly-forecast">
          {forecast.hourly.map((hour, index) => (
            <div key={index} className="hour-card">
              <div className="hour-time">
                {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric' })}
              </div>
              {getWeatherIcon(hour.weather[0].description)}
              <div className="hour-temp">{Math.round(hour.main.temp)}°</div>
            </div>
          ))}
        </div>
      </div>

      <div className="forecast-section">
        <h3>5-Day Forecast</h3>
        <div className="daily-forecast">
          {forecast.daily.map((day, index) => (
            <div key={index} className="day-card">
              <div className="day-name">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              {getWeatherIcon(day.weather[0].description)}
              <div className="day-temps">
                <span className="high">{Math.round(day.main.temp_max)}°</span>
                <span className="low">{Math.round(day.main.temp_min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forecast;