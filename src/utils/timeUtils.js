import { DateTime } from 'luxon';

export const calculateDaylight = (sunrise, sunset, timezone) => {
  if (!sunrise || !sunset) return '--';
  
  try {
    const start = DateTime.fromSeconds(sunrise, { zone: 'utc' })
      .plus({ seconds: timezone });
    const end = DateTime.fromSeconds(sunset, { zone: 'utc' })
      .plus({ seconds: timezone });
    
    const duration = end.diff(start, ['hours', 'minutes']);
    return `${duration.hours}h ${Math.round(duration.minutes)}m`;
  } catch {
    return '--';
  }
};

export const formatLocalTime = (timestamp, timezone) => {
  try {
    return DateTime.fromSeconds(timestamp, { zone: 'utc' })
      .plus({ seconds: timezone })
      .toLocaleString(DateTime.TIME_SIMPLE);
  } catch {
    return '--:--';
  }
};