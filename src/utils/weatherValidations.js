let apiQuirks = {};
let humidityThresholds = {};

export const fetchApiQuirks = async () => {
  try {
    const response = await fetch('/api-quirks');
    if (!response.ok) throw new Error('Failed to fetch API quirks');
    apiQuirks = await response.json();
  } catch (err) {
    console.error('Error fetching API quirks:', err);
  }
};

export const fetchHumidityThresholds = async () => {
  try {
    const response = await fetch('/humidity-thresholds');
    if (!response.ok) throw new Error('Failed to fetch humidity thresholds');
    humidityThresholds = await response.json();
  } catch (err) {
    console.error('Error fetching humidity thresholds:', err);
  }
};

const isDesertRegion = (lat) => Math.abs(lat) >= 15 && Math.abs(lat) <= 35;

export const validateHumidity = (humidity, cityName, lat) => {
    // Convert to number and handle NaN/undefined cases
    let normalized = Number(humidity);
    
    // If conversion fails or value is invalid, use default
    if (isNaN(normalized) || normalized === undefined) {
      console.warn(`Invalid humidity value for ${cityName}, using default`);
      return isDesertRegion(lat) ? 20 : 50; // Default values based on location
    }
  
    // Apply location-specific fixes from quirks
    if (apiQuirks[cityName]?.humidity?.min && normalized < apiQuirks[cityName].humidity.min) {
      normalized = apiQuirks[cityName].humidity.min;
    } else if (isDesertRegion(lat) && normalized < 20) {
      normalized = 20;
    }
  
    // Ensure value is between 0-100
    return Math.max(0, Math.min(100, normalized));
  };
  
export const validateImprovedHumidity = (temp, humidity) => {
  const thresholds = humidityThresholds || {
    cold: 50, cool: 40, mild: 30, warm: 20
  };

  const minHumidity = temp < 0 ? thresholds.cold :
                    temp < 10 ? thresholds.cool :
                    temp < 20 ? thresholds.mild : thresholds.warm;

  return Math.max(minHumidity, humidity);
};

export const validateWindSpeed = (speed, cityName) => {
  let normalized = Number(speed) || 0;

  if (apiQuirks[cityName]?.wind) {
    if (apiQuirks[cityName].wind.max && normalized > apiQuirks[cityName].wind.max) {
      normalized = apiQuirks[cityName].wind.max;
    }
    if (apiQuirks[cityName].wind.multiplier) {
      normalized *= apiQuirks[cityName].wind.multiplier;
    }
  }

  return Math.min(25, Math.max(0, normalized)).toFixed(1);
};

export const normalizeCondition = (temp, description, humidity) => {
  if (humidity > 90) return 'Humid ' + description;
  if (temp < 0) return 'Freezing ' + description;
  if (temp > 30) return 'Hot ' + description;
  return description;
};