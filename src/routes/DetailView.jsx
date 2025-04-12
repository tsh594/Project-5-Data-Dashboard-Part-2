// routes/DetailView.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WeatherChart from '../components/WeatherChart';

const DetailView = ({ weatherData, fetchBackgroundImage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (weatherData.length > 0) {
      const foundLocation = weatherData.find((item) => item.id === parseFloat(id));
      setLocation(foundLocation);
    }
  }, [id, weatherData]);

  useEffect(() => {
    if (location) {
      fetchBackgroundImage(location.name)
        .then((image) => setBackgroundImage(image))
        .catch((err) => console.error('Error fetching background image:', err));
    }
  }, [location, fetchBackgroundImage]);

  if (!weatherData.length) {
    return (
      <div className="container">
        <div className="loading-banner">Loading weather data...</div>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container">
        <div className="error-banner">Location not found.</div>
        <button onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div
      className="detail-view"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      <h1>{location.name}</h1>
      <p>Temperature: {location.main.temp}°C</p>
      <p>Feels Like: {location.main.feels_like}°C</p>
      <p>Humidity: {location.main.humidity}%</p>
      <p>Wind Speed: {location.wind.speed} m/s</p>
      <p>Weather: {location.weather[0].description}</p>

      <WeatherChart weatherData={[location]} detailedView />

      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
};

export default DetailView;