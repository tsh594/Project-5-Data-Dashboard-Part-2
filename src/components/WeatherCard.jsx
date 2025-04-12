import { useState, useEffect } from 'react';
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';

const WeatherCard = ({ weather, onClick }) => {
  const [cityImage, setCityImage] = useState('');
  const PEXELS_KEY = import.meta.env.VITE_APP_PEXELS_KEY;
  const UNSPLASH_KEY = import.meta.env.VITE_APP_UNSPLASH_KEY;

  useEffect(() => {
    const fetchCityImage = async () => {
      try {
        // Try Pexels first
        const pexelsRes = await fetch(
          `https://api.pexels.com/v1/search?query=${weather.name}+city&per_page=1`,
          { headers: { Authorization: PEXELS_KEY } }
        );
        const pexelsData = await pexelsRes.json();
        if (pexelsData.photos?.length > 0) {
          setCityImage(pexelsData.photos[0].src.large);
          return;
        }

        // Fallback to Unsplash
        const unsplashRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${weather.name}&client_id=${UNSPLASH_KEY}`
        );
        const unsplashData = await unsplashRes.json();
        if (unsplashData.results?.length > 0) {
          setCityImage(unsplashData.results[0].urls.regular);
          return;
        }

        // Ultimate fallback to generic city image
        setCityImage('/default-city.jpg');
      } catch (err) {
        console.error('Image fetch error:', err);
        setCityImage('/default-city.jpg');
      }
    };

    fetchCityImage();
  }, [weather.name]);

   const getWeatherIcon = (main) => {
     const iconSize = 80;
     switch(main.toLowerCase()) {
       case 'clear': 
         return <WiDaySunny size={iconSize} className="weather-icon-sunny" />;
       case 'rain': 
         return <WiRain size={iconSize} className="weather-icon-rain" />;
       case 'snow': 
         return <WiSnow size={iconSize} className="weather-icon-snow" />;
       case 'clouds': 
         return <WiCloudy size={iconSize} className="weather-icon-cloudy" />;
       default: 
         return <WiDaySunny size={iconSize} className="weather-icon-sunny" />;
     }
   };
 
   return (
  <div 
      className="weather-card"
      onClick={onClick}
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), url(${cityImage || '/default-city.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
    <div className="weather-card" onClick={onClick}>
       <div className="location-info">
         <h1 className="city-name">{weather.name}</h1>
         <div className="location-details">
           <span>{weather.sys.country}</span>
           <span>Lat: {weather.coord.lat.toFixed(2)}</span>
           <span>Lon: {weather.coord.lon.toFixed(2)}</span>
         </div>
       </div>
 
       <div className="current-weather">
         <div className="weather-icon">
           {getWeatherIcon(weather.weather[0].main)}
         </div>
         <div className="temperature">
           {Math.round(weather.main.temp)}°C
           <div className="feels-like">
             <WiThermometer className="thermometer-icon" /> 
             Feels like {Math.round(weather.main.feels_like)}°C
           </div>
         </div>
       </div>
 
       <div className="weather-details">
         <div className="detail-item">
           <WiHumidity className="humidity-icon" />
           <div className="detail-text">
             <span>Humidity</span>
             <span>{weather.main.humidity}%</span>
           </div>
         </div>
         <div className="detail-item">
           <WiStrongWind className="wind-icon" />
           <div className="detail-text">
             <span>Wind</span>
             <span>{weather.wind.speed} m/s</span>
           </div>
         </div>
         <div className="detail-item">
           <WiSunrise className="sunrise-icon" />
           <div className="detail-text">
             <span>Sunrise</span>
             <span>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
           </div>
         </div>
         <div className="detail-item">
           <WiSunset className="sunset-icon" />
           <div className="detail-text">
             <span>Sunset</span>
             <span>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
           </div>
         </div>
       </div>
     </div>
      </div>
   );
 };
 
 export default WeatherCard;