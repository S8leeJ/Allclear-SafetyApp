import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FriendsList({ onFriendsUpdate }) {
  const { getAuthHeaders } = useAuth();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingFriend, setEditingFriend] = useState(null);

  // Add friend form state
  const [addFriendForm, setAddFriendForm] = useState({
    username: '',
    email: '',
    lat: '',
    lng: '',
    status: 'Unknown'
  });

  // Edit coordinates form state
  const [editCoordinatesForm, setEditCoordinatesForm] = useState({
    lat: '',
    lng: ''
  });

  // Load friends on component mount
  useEffect(() => {
    loadFriends();
  }, []);

  // Update map when friends change
  useEffect(() => {
    if (onFriendsUpdate) {
      onFriendsUpdate(friends);
    }
  }, [friends, onFriendsUpdate]);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/friends', {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
      } else {
        setMessage({ type: 'error', text: 'Failed to load friends' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: addFriendForm.username,
          email: addFriendForm.email,
          location: {
            lat: parseFloat(addFriendForm.lat),
            lng: parseFloat(addFriendForm.lng)
          },
          status: addFriendForm.status
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFriends(prev => [...prev, data.friend]);
        setMessage({ type: 'success', text: 'Friend added successfully!' });
        setShowAddForm(false);
        setAddFriendForm({
          username: '',
          email: '',
          lat: '',
          lng: '',
          status: 'Unknown'
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add friend' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (friendId, newStatus) => {
    try {
      const response = await fetch(`/api/friends/${friendId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(prev => 
          prev.map(friend => 
            friend.id === friendId ? data.friend : friend
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleUpdateLocation = async (friendId) => {
    const lat = parseFloat(editCoordinatesForm.lat);
    const lng = parseFloat(editCoordinatesForm.lng);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setMessage({ type: 'error', text: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.' });
      return;
    }

    try {
      const response = await fetch(`/api/friends/${friendId}/location`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ lat, lng })
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(prev => 
          prev.map(friend => 
            friend.id === friendId ? data.friend : friend
          )
        );
        setMessage({ type: 'success', text: 'Location updated successfully!' });
        setEditingFriend(null);
        setEditCoordinatesForm({ lat: '', lng: '' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to update location' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const handleDeleteFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setFriends(prev => prev.filter(friend => friend.id !== friendId));
        setMessage({ type: 'success', text: 'Friend removed successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove friend' });
    }
  };

  const startEditingLocation = (friend) => {
    setEditingFriend(friend.id);
    setEditCoordinatesForm({
      lat: friend.lat.toString(),
      lng: friend.lng.toString()
    });
  };

  const cancelEditingLocation = () => {
    setEditingFriend(null);
    setEditCoordinatesForm({ lat: '', lng: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Safe': return 'text-green-400 bg-green-400/20';
      case 'In Risk Zone': return 'text-yellow-400 bg-yellow-400/20';
      case 'Emergency': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Safe': return '✅';
      case 'In Risk Zone': return '⚠️';
      case 'Emergency': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Friends Management</h2>
            <p className="text-gray-400">Manage your safety network and track friend locations</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
          >
            <span>{showAddForm ? '✕' : '+'}</span>
            <span>{showAddForm ? 'Cancel' : 'Add Friend'}</span>
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

      {/* Add Friend Form */}
      {showAddForm && (
        <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Add New Friend</h3>
            <p className="text-gray-400 text-sm">Enter your friend's information to add them to your safety network</p>
          </div>
          
          <form onSubmit={handleAddFriend} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={addFriendForm.username}
                    onChange={(e) => setAddFriendForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter friend's name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={addFriendForm.email}
                    onChange={(e) => setAddFriendForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="friend@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
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
                    value={addFriendForm.lat}
                    onChange={(e) => setAddFriendForm(prev => ({ ...prev, lat: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={addFriendForm.lng}
                    onChange={(e) => setAddFriendForm(prev => ({ ...prev, lng: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., -95.3698"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <span className="mr-2">🔄</span>
                Current Status
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Safety Status
                </label>
                <select
                  value={addFriendForm.status}
                  onChange={(e) => setAddFriendForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Unknown">❓ Unknown</option>
                  <option value="Safe">✅ Safe</option>
                  <option value="In Risk Zone">⚠️ In Risk Zone</option>
                  <option value="Emergency">🚨 Emergency</option>
                </select>
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Add Friend</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Your Friends</h3>
            <p className="text-gray-400 text-sm">{friends.length} friend{friends.length !== 1 ? 's' : ''} in your network</p>
          </div>
        </div>

        {isLoading && friends.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">Loading friends...</span>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-400 text-lg mb-2">No friends added yet</p>
            <p className="text-gray-500 text-sm">Add your first friend to start building your safety network</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend.id} className="bg-black/20 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {friend.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{friend.name}</h4>
                      <p className="text-gray-400 text-sm">{friend.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(friend.status)}`}>
                      {getStatusIcon(friend.status)} {friend.status}
                    </span>
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-medium">Location:</span>
                    {editingFriend === friend.id ? (
                      <button
                        onClick={() => cancelEditingLocation()}
                        className="text-gray-400 hover:text-white text-xs transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditingLocation(friend)}
                        className="text-blue-400 hover:text-blue-300 text-xs transition-colors duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {editingFriend === friend.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editCoordinatesForm.lat}
                            onChange={(e) => setEditCoordinatesForm(prev => ({ ...prev, lat: e.target.value }))}
                            className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Longitude"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdateLocation(friend.id)}
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
                    <p className="text-white text-sm">{friend.lat.toFixed(4)}, {friend.lng.toFixed(4)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <select
                      value={friend.status}
                      onChange={(e) => handleUpdateStatus(friend.id, e.target.value)}
                      className="px-2 py-1 bg-black/50 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Unknown">❓ Unknown</option>
                      <option value="Safe">✅ Safe</option>
                      <option value="In Risk Zone">⚠️ In Risk Zone</option>
                      <option value="Emergency">🚨 Emergency</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleDeleteFriend(friend.id)}
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