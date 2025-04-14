import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { scaleLinear } from 'd3-scale';

const TemperatureLineChart = ({ forecastData }) => {
  // Process forecast data for the next 24 hours
  const chartData = forecastData?.slice(0, 24).map(item => {
    const date = new Date(item.dt * 1000);
    return {
      time: `${date.getHours()}:00`,
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      hour: date.getHours()
    };
  }) || [];

  // Color scale based on temperature
  const getColor = (temp) => {
    const colorScale = scaleLinear()
      .domain([-10, 0, 10, 20, 30, 40])
      .range(['#4e79a7', '#76b7b2', '#59a14f', '#edc948', '#f28e2b', '#e15759']);
    return colorScale(temp);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="chart-tooltip">
        <div className="tooltip-header">{label}</div>
        <div className="tooltip-item">
          <span>Temperature:</span>
          <span style={{ color: getColor(payload[0].value) }}>
            {payload[0].value}°C
          </span>
        </div>
        <div className="tooltip-item">
          <span>Feels Like:</span>
          <span>{payload[1].value}°C</span>
        </div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <h3>24-Hour Temperature Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barCategoryGap="5%"
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2E1B5B" 
            vertical={false} 
          />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: '#D4BFFF', fontSize: 12 }}
            tickLine={{ stroke: '#7F5AF0' }}
          />
          <YAxis
            tick={{ fill: '#D4BFFF', fontSize: 12 }}
            tickLine={{ stroke: '#7F5AF0' }}
            width={40}
            domain={['dataMin - 5', 'dataMax + 5']}
            unit="°C"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="temp"
            name="Temperature"
            shape={(props) => {
              const { x, y, width, height, value } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={getColor(value)}
                  rx={4}
                  ry={4}
                />
              );
            }}
          />
          <Bar
            dataKey="feels_like"
            name="Feels Like"
            fill="transparent"
            stroke="#B19CFF"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

TemperatureLineChart.propTypes = {
  forecastData: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
      main: PropTypes.shape({
        temp: PropTypes.number.isRequired,
        feels_like: PropTypes.number.isRequired
      }).isRequired
    })
  )
};

export default TemperatureLineChart;