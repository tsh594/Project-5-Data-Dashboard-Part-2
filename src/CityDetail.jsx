import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Forecast from './components/Forecast';

const CityDetail = ({ setBgStyle }) => {
  const { cityId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const PEXELS_KEY = import.meta.env.VITE_APP_PEXELS_KEY;

  const fetchCityBackground = async (cityName) => {
    try {
      // Primary Pexels request
      const pexelsRes = await fetch(
        `https://api.pexels.com/v1/search?query=${cityName}+skyline&orientation=landscape&per_page=1`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      const pexelsData = await pexelsRes.json();
      if (pexelsData.photos?.length > 0) {
        return pexelsData.photos[0].src.large2x;
      }

      // Fallback to Unsplash
      const unsplashRes = await fetch(
        `https://api.unsplash.com/photos/random?query=${cityName}&orientation=landscape&client_id=${import.meta.env.VITE_APP_UNSPLASH_KEY}`
      );
      const unsplashData = await unsplashRes.json();
      return unsplashData.urls?.regular || '/default-bg.jpg';

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

        const [weatherData, forecastData] = await Promise.all([
          weatherRes.json(),
          forecastRes.json()
        ]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setBgStyle({ backgroundImage: "url('/nature1.jpg')" });
    };
  }, [cityId, setBgStyle]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="weather-content">
      <Forecast forecast={{
        hourly: data.forecast.slice(0, 8),
        daily: data.forecast.filter((_, i) => i % 8 === 0)
      }} />
      <Link to="/" className="close-btn">Back to List</Link>
    </div>
  );
};

export default CityDetail;