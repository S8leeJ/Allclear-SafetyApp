import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FriendsList from './FriendsList';
import LocationsList from './LocationsList';
import MapView from './MapView';

const OPENWEATHER_API_KEY = '6faa37b4692e4cbe58cbf7709309db5c';

export default function WeatherDashboard() {
  const { getAuthHeaders } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeView, setActiveView] = useState('weather'); // 'weather', 'friends', 'locations'
  const [mapCenter, setMapCenter] = useState([29.7604, -95.3698]); // default Houston

  useEffect(() => {
    if (searchQuery) {
      fetchWeatherData();
    }
  }, [searchQuery]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${OPENWEATHER_API_KEY}&units=metric`);

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeatherData(data);
      // Update map center to the searched city
      setMapCenter([data.coord.lat, data.coord.lon]);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData();
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherDescription = (weather) => {
    return weather[0]?.description || 'Unknown';
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const handleFriendsUpdate = (updatedFriends) => {
    setFriends(updatedFriends);
  };

  const handleLocationsUpdate = (updatedLocations) => {
    setLocations(updatedLocations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-200 py-5">Weather & Safety Dashboard</h1>
          
          <p className="text-gray-300">Monitor weather conditions and manage your safety network</p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/30 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setActiveView('weather')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeView === 'weather'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-black/20'
                }`}
            >
              🌤️ Weather
            </button>
            <button
              onClick={() => setActiveView('friends')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeView === 'friends'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-black/20'
                }`}
            >
              👥 Friends
            </button>
            <button
              onClick={() => setActiveView('locations')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeView === 'locations'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-black/20'
                }`}
            >
              📍 Locations
            </button>
          </div>
        </div>

        {/* Map View - Shows both friends and locations with weather radar */}
        <div className="mb-6">
          <div className="bg-black/30 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Interactive Map with Weather Radar</h3>
              <p className="text-gray-400 text-sm">View your friends, locations, and weather conditions</p>
            </div>
            <MapView
              friends={friends}
              locations={locations}
              center={mapCenter}
            />
          </div>
        </div>

        {/* Weather View */}
        {activeView === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Section */}
            <div className="lg:col-span-1">
              <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Weather Search</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City Name
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter city name..."
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !searchQuery.trim()}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? 'Searching...' : 'Search Weather'}
                  </button>
                </form>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Weather Display */}
            <div className="lg:col-span-2">
              {weatherData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Weather */}
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Weather</h3>
                    <div className="text-center">
                      <img
                        src={getWeatherIcon(weatherData.weather[0].icon)}
                        alt="Weather icon"
                        className="mx-auto w-20 h-20"
                      />
                      <div className="text-4xl font-bold text-white mt-2">
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      <div className="text-gray-300 mt-1">
                        {getWeatherDescription(weatherData.weather)}
                      </div>
                      <div className="text-gray-400 text-sm mt-2">
                        Feels like {Math.round(weatherData.main.feels_like)}°C
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Weather Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Humidity</span>
                        <span className="text-white">{weatherData.main.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Wind Speed</span>
                        <span className="text-white">{weatherData.wind.speed} m/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Wind Direction</span>
                        <span className="text-white">{getWindDirection(weatherData.wind.deg)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Pressure</span>
                        <span className="text-white">{weatherData.main.pressure} hPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Visibility</span>
                        <span className="text-white">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Temperature Range */}
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Temperature Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Min</span>
                        <span className="text-blue-400 font-semibold">{Math.round(weatherData.main.temp_min)}°C</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Max</span>
                        <span className="text-red-400 font-semibold">{Math.round(weatherData.main.temp_max)}°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
                    <div className="space-y-2">
                      <div className="text-white font-medium">{weatherData.name}</div>
                      <div className="text-gray-300 text-sm">{weatherData.sys.country}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(weatherData.dt * 1000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-black/30 rounded-lg p-12 border border-gray-700 text-center">
                  <div className="text-gray-400 text-lg mb-2">Search for a city to see weather information</div>
                  <div className="text-gray-500 text-sm">Enter a city name and click search to get started</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Friends View */}
        {activeView === 'friends' && (
          <div className="w-full">
            <FriendsList onFriendsUpdate={handleFriendsUpdate} />
          </div>
        )}

        {/* Locations View */}
        {activeView === 'locations' && (
          <div className="w-full">
            <LocationsList onLocationsUpdate={handleLocationsUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}
