import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LocationsList({ onLocationsUpdate }) {
  const { getAuthHeaders } = useAuth();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingLocation, setEditingLocation] = useState(null);

  // Add location form state
  const [addLocationForm, setAddLocationForm] = useState({
    name: '',
    type: 'Other',
    lat: '',
    lng: '',
    description: ''
  });

  // Edit coordinates form state
  const [editCoordinatesForm, setEditCoordinatesForm] = useState({
    lat: '',
    lng: ''
  });

  // Location types
  const locationTypes = [
    'Home',
    'Work',
    'School',
    'Hospital',
    'Police Station',
    'Fire Station',
    'Shelter',
    'Gas Station',
    'Grocery Store',
    'Pharmacy',
    'Bank',
    'Other'
  ];

  // Load locations on component mount
  useEffect(() => {
    loadLocations();
  }, []);

  // Update map when locations change
  useEffect(() => {
    if (onLocationsUpdate) {
      onLocationsUpdate(locations);
    }
  }, [locations, onLocationsUpdate]);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/locations', {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations);
      } else {
        setMessage({ type: 'error', text: 'Failed to load locations' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: addLocationForm.name,
          type: addLocationForm.type,
          location: {
            lat: parseFloat(addLocationForm.lat),
            lng: parseFloat(addLocationForm.lng)
          },
          description: addLocationForm.description
        })
      });

      const data = await response.json();

      if (response.ok) {
        setLocations(prev => [...prev, data.location]);
        setMessage({ type: 'success', text: 'Location added successfully!' });
        setShowAddForm(false);
        setAddLocationForm({
          name: '',
          type: 'Other',
          lat: '',
          lng: '',
          description: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add location' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLocation = async (locationId) => {
    const lat = parseFloat(editCoordinatesForm.lat);
    const lng = parseFloat(editCoordinatesForm.lng);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setMessage({ type: 'error', text: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.' });
      return;
    }

    try {
      const response = await fetch(`/api/locations/${locationId}/coordinates`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ lat, lng })
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(prev => 
          prev.map(location => 
            location.id === locationId ? data.location : location
          )
        );
        setMessage({ type: 'success', text: 'Location updated successfully!' });
        setEditingLocation(null);
        setEditCoordinatesForm({ lat: '', lng: '' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to update location' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to remove this location?')) {
      return;
    }

    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setLocations(prev => prev.filter(location => location.id !== locationId));
        setMessage({ type: 'success', text: 'Location removed successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove location' });
    }
  };

  const startEditingLocation = (location) => {
    setEditingLocation(location.id);
    setEditCoordinatesForm({
      lat: location.lat.toString(),
      lng: location.lng.toString()
    });
  };

  const cancelEditingLocation = () => {
    setEditingLocation(null);
    setEditCoordinatesForm({ lat: '', lng: '' });
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'Home': return '🏠';
      case 'Work': return '💼';
      case 'School': return '🎓';
      case 'Hospital': return '🏥';
      case 'Police Station': return '👮';
      case 'Fire Station': return '🚒';
      case 'Shelter': return '🏘️';
      case 'Gas Station': return '⛽';
      case 'Grocery Store': return '🛒';
      case 'Pharmacy': return '💊';
      case 'Bank': return '🏦';
      default: return '📍';
    }
  };

  const getLocationColor = (type) => {
    switch (type) {
      case 'Home': return 'bg-blue-600';
      case 'Work': return 'bg-green-600';
      case 'School': return 'bg-purple-600';
      case 'Hospital': return 'bg-red-600';
      case 'Police Station': return 'bg-blue-800';
      case 'Fire Station': return 'bg-red-800';
      case 'Shelter': return 'bg-yellow-600';
      case 'Gas Station': return 'bg-orange-600';
      case 'Grocery Store': return 'bg-green-500';
      case 'Pharmacy': return 'bg-pink-600';
      case 'Bank': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Locations Management</h2>
            <p className="text-gray-400">Manage important locations and landmarks for emergency planning</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 flex items-center space-x-2"
          >
            <span>{showAddForm ? '✕' : '+'}</span>
            <span>{showAddForm ? 'Cancel' : 'Add Location'}</span>
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500 text-green-300' 
              : 'bg-red-500/20 border-red-500 text-red-300'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Add New Location</h3>
            <p className="text-gray-400 text-sm">Enter location details to add it to your emergency planning map</p>
          </div>
          
          <form onSubmit={handleAddLocation} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    value={addLocationForm.name}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., My House, Downtown Hospital"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Type *
                  </label>
                  <select
                    value={addLocationForm.type}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {locationTypes.map(type => (
                      <option key={type} value={type}>
                        {getLocationIcon(type)} {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Coordinates */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Location Coordinates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={addLocationForm.lat}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, lat: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 29.7604"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={addLocationForm.lng}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, lng: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., -95.3698"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Additional Details
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={addLocationForm.description}
                  onChange={(e) => setAddLocationForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Additional details about this location (e.g., 'Main entrance on 5th Street', '24/7 emergency services')"
                  rows="3"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Add Location</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations List */}
      <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Your Locations</h3>
            <p className="text-gray-400 text-sm">{locations.length} location{locations.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {isLoading && locations.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-400">Loading locations...</span>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-gray-400 text-lg mb-2">No locations added yet</p>
            <p className="text-gray-500 text-sm">Add your first location to start building your emergency planning map</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="bg-black/20 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${getLocationColor(location.type)} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-lg">
                        {getLocationIcon(location.type)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{location.name}</h4>
                      <p className="text-gray-400 text-sm">{location.type}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {location.description && (
                  <div className="mb-3">
                    <p className="text-gray-300 text-sm italic">"{location.description}"</p>
                  </div>
                )}

                {/* Coordinates Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-medium">Coordinates:</span>
                    {editingLocation === location.id ? (
                      <button
                        onClick={() => cancelEditingLocation()}
                        className="text-gray-400 hover:text-white text-xs transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditingLocation(location)}
                        className="text-green-400 hover:text-green-300 text-xs transition-colors duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {editingLocation === location.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editCoordinatesForm.lat}
                            onChange={(e) => setEditCoordinatesForm(prev => ({ ...prev, lat: e.target.value }))}
                            className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Latitude"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editCoordinatesForm.lng}
                            onChange={(e) => setEditCoordinatesForm(prev => ({ ...prev, lng: e.target.value }))}
                            className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Longitude"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdateLocation(location.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => cancelEditingLocation()}
                          className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white text-sm">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Added: {new Date(location.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleDeleteLocation(location.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 