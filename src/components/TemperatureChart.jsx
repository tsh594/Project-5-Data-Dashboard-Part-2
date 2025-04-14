import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// City abbreviation mapping
const cityAbbreviations = {
  'New York': 'NYC',
  'Los Angeles': 'LAX',
  'London': 'LDN',
  'Palais-Royal (Paris)': 'PAR',
  'Tokyo': 'TYO',
  'Sydney': 'SYD',
  'Ash Shindaghah (Dubai)': 'DXB',
  'Mumbai': 'BOM',
  'San Francisco': 'SFO',
  'Konkan Division': 'KON',
  'Alt-Kölln (Berlin)': 'BER',
  'Downtown Toronto': 'TOR',
  'Liberdade (São Paulo)': 'SAO',
  'Shanghai Municipality': 'SHA',
  'Chicago': 'CHI',
  'Singapore': 'SIN',
  'Hong Kong': 'HKG',
  'Seoul': 'SEL',
  'Moscow': 'MOW',
  'Osaka': 'OSA'
};

const TemperatureChart = ({ data }) => {
  // Format city names to abbreviations
  const formatCityName = (name) => {
    return cityAbbreviations[name] || name.slice(0, 3).toUpperCase();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <h4 className="tooltip-city">{label}</h4>
          <div className="tooltip-item">
            <span>Temperature:</span>
            <span>{payload[0].value}°C</span>
          </div>
          <div className="tooltip-item">
            <span>Feels Like:</span>
            <span>{payload[1].value}°C</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3>Temperature Comparison (°C)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          {/* ... (keep your existing CartesianGrid, XAxis, YAxis, and Tooltip) */}

          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2E1B5B"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            tickFormatter={formatCityName}
            tick={{
              fill: '#D4BFFF',
              fontSize: 12,
              letterSpacing: '0.5px'
            }}
            tickLine={{ stroke: '#7F5AF0' }}
            interval={0}
          />
          <YAxis
            tick={{ 
              fill: '#D4BFFF', 
              fontSize: 12
            }} 
            tickLine={{ stroke: '#7F5AF0' }}
            width={80}
            unit="°C"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          
          <Legend
            layout="vertical"
            verticalAlign="top"
            align="left"
            wrapperStyle={{
              left: 20,
              top: 20,
              backgroundColor: 'rgba(46, 4, 89, 0.7)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          />
          <Bar 
            dataKey="temp"
            name="Temperature"
            fill="url(#tempGradient)"
            radius={[6, 6, 0, 0]}
          />
          <Bar 
            dataKey="feels_like"
            name="Feels Like"
            fill="url(#feelsLikeGradient)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9D70FF" />
              <stop offset="100%" stopColor="#7F5AF0" />
            </linearGradient>
            <linearGradient id="feelsLikeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B19CFF" />
              <stop offset="100%" stopColor="#8884d8" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

TemperatureChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TemperatureChart;