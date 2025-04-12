export interface WeatherData {
    id: number;
    name: string;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    coord: {
      lat: number;
      lon: number;
    };
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
    forecast: Array<{
      dt: number;
      main: {
        temp: number;
        temp_min: number;
        temp_max: number;
      };
      weather: Array<{
        description: string;
      }>;
    }>;
  }