import React, { useState } from 'react';
import MapView from './MapView';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export default function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState([29.7604, -95.3698]); // default Houston
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async (cityName) => {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=imperial`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message);
        setWeather(null);
        return;
      }

      setWeather(data);
      setPosition([data.coord.lat, data.coord.lon]);
    } catch (err) {
      setError('Error fetching weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city);
  };

  const getWeatherIcon = (weatherCode) => {
    const weatherIcons = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return weatherIcons[weatherCode] || '🌤️';
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="flex h-screen">
      {/* Weather Dashboard Sidebar */}
      <div className="w-96 p-6 bg-black/80 backdrop-blur-sm border-r border-gray-700 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Weather Search</h2>
          <p className="text-gray-400 text-sm">Search for weather information by city</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Weather Information Grid */}
        {weather && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{weather.name}, {weather.sys.country}</h3>
                  <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-4xl">
                  {getWeatherIcon(weather.weather[0].icon)}
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(weather.main.temp)}°F
                </div>
                <p className="text-gray-300 capitalize">{weather.weather[0].description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <p className="text-gray-400">Feels Like</p>
                  <p className="text-white font-semibold">{Math.round(weather.main.feels_like)}°F</p>
                </div>
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <p className="text-gray-400">Humidity</p>
                  <p className="text-white font-semibold">{weather.main.humidity}%</p>
                </div>
              </div>
            </div>

            {/* Detailed Weather Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Temperature Range */}
              <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🌡️</span>
                  <h4 className="text-white font-semibold">Temperature</h4>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">High</span>
                    <span className="text-white">{Math.round(weather.main.temp_max)}°F</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Low</span>
                    <span className="text-white">{Math.round(weather.main.temp_min)}°F</span>
                  </div>
                </div>
              </div>

              {/* Wind Information */}
              <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💨</span>
                  <h4 className="text-white font-semibold">Wind</h4>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Speed</span>
                    <span className="text-white">{weather.wind.speed} mph</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Direction</span>
                    <span className="text-white">{getWindDirection(weather.wind.deg)}</span>
                  </div>
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">📊</span>
                  <h4 className="text-white font-semibold">Pressure</h4>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{weather.main.pressure}</div>
                  <p className="text-gray-400 text-sm">hPa</p>
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">👁️</span>
                  <h4 className="text-white font-semibold">Visibility</h4>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {weather.visibility ? Math.round(weather.visibility / 1000) : 'N/A'}
                  </div>
                  <p className="text-gray-400 text-sm">km</p>
                </div>
              </div>
            </div>

            {/* Additional Weather Details */}
            <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Weather Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cloud Cover</span>
                  <span className="text-white">{weather.clouds.all}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunrise</span>
                  <span className="text-white">
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunset</span>
                  <span className="text-white">
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coordinates</span>
                  <span className="text-white">{weather.coord.lat.toFixed(2)}, {weather.coord.lon.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">Loading weather data...</span>
          </div>
        )}
      </div>

      {/* Map View */}
      <div className="flex-1">
        <MapView center={position} />
      </div>
    </div>
  );
}
