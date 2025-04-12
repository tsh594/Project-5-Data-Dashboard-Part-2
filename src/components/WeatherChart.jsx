// components/WeatherChart.js
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherChart = ({ weatherData, detailedView = false }) => {
  if (!weatherData || weatherData.length === 0) return null;

  // Helper function to safely get forecast data
  const getForecastData = (location) => {
    try {
      return location.forecast?.slice(0, 8) || [];
    } catch {
      return [];
    }
  };

  // Temperature comparison chart
  const tempChartData = {
    labels: weatherData.map(loc => loc.name),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.map(loc => loc.main.temp),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Feels Like (°C)',
        data: weatherData.map(loc => loc.main.feels_like),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Humidity chart
  const humidityChartData = {
    labels: weatherData.map(loc => loc.name),
    datasets: [
      {
        label: 'Humidity (%)',
        data: weatherData.map(loc => loc.main.humidity),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Detailed temperature forecast for single location
  const detailedTempData = weatherData.length === 1 ? {
    labels: getForecastData(weatherData[0]).map((_, i) => `${i * 3}h`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: getForecastData(weatherData[0]).map(hour => hour.main.temp),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: true
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: detailedView ? '24 Hour Temperature Forecast' : 'Weather Data',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="charts-container">
      {!detailedView ? (
        <>
          <div className="chart">
            <Bar 
              data={tempChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Temperature Comparison',
                  },
                },
              }} 
            />
          </div>
          <div className="chart">
            <Bar 
              data={humidityChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Humidity Levels',
                  },
                },
              }} 
            />
          </div>
        </>
      ) : (
        detailedTempData && (
          <div className="chart detailed-chart">
            <Line 
              data={detailedTempData} 
              options={chartOptions} 
            />
          </div>
        )
      )}
    </div>
  );
};

export default WeatherChart;