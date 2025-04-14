import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const cityAbbreviations = {
  'New York': 'NYC',
  'Los Angeles': 'LAX',
  'London': 'LDN',
  'Palais-Royal (Paris)': 'PAR',
  'Tokyo': 'TYO',
  'Sydney': 'SYD',
  'Ash Shindaghah (Dubai)': 'DXB',
  'Singapore': 'SIN',
  'Mumbai': 'BOM',
  'San Francisco': 'SFO',
  'Konkan Division': 'KON',
  'Alt-Kölln (Berlin)': 'BER',
  'Downtown Toronto': 'TOR',
  'Liberdade (São Paulo)': 'SAO',
  'Shanghai Municipality': 'SHA',
  'Chicago': 'CHI',
  'Hong Kong': 'HKG',
  'Seoul': 'SEL',
  'Moscow': 'MOW',
  'Osaka': 'OSA'
};

const HumidityChart = ({ data }) => {
  const formatCityName = (name) => {
    return cityAbbreviations[name] || name.slice(0, 3).toUpperCase();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip" style={{
          background: 'rgba(42, 9, 68, 0.95)',
          border: '1px solid #9D70FF',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          color: '#F3EFFF'
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0',
            color: '#E2D1FF',
            fontWeight: 600
          }}>{label}</h4>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '4px 0'
            }}>
              <span style={{ marginRight: '16px' }}>{entry.name}:</span>
              <span>{entry.value}{entry.unit || '%'}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Humidity Levels (%)</h3>
        <div className="chart-error">No humidity data available</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Humidity Levels (%)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
        >
          {/* Identical grid and axes styling */}
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
            tick={{ fill: '#D4BFFF', fontSize: 12 }} 
            tickLine={{ stroke: '#7F5AF0' }}
            unit="%"
            width={80}
          />

          {/* Exact same tooltip implementation */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(127, 90, 240, 0.1)' }}
          />

          {/* Legend with identical positioning and styling */}
          <Legend
            layout="vertical"
            verticalAlign="top"
            align="left"
            wrapperStyle={{
              left: 20,
              top: 10,
              backgroundColor: 'rgba(46, 4, 89, 0.7)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(127, 90, 240, 0.3)',
              color: '#E2D1FF'
            }}
            iconType="circle"
            iconSize={10}
          />

          {/* Bars with IDENTICAL hover effects */}
          <Bar 
            dataKey="humidity"
            name="Humidity"
            fill="url(#tempGradient)" // Using tempChart's gradient
            radius={[6, 6, 0, 0]}
            barSize={35}
            activeBar={{
              fill: 'url(#tempHover)', // Same as temperature
              stroke: '#B19CFF',
              strokeWidth: 1,
              radius: [6, 6, 0, 0]
            }}
          />

          <defs>
            {/* EXACT SAME GRADIENTS as TemperatureChart */}
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9D70FF" />
              <stop offset="100%" stopColor="#7F5AF0" />
            </linearGradient>
            <linearGradient id="tempHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BD90FF" />
              <stop offset="100%" stopColor="#9D7AFF" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

HumidityChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      humidity: PropTypes.number.isRequired,
      dew_point: PropTypes.number
    })
  )
};

export default HumidityChart;