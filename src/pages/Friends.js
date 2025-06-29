import React, { useState } from 'react';
import FriendsList from '../components/FriendsList';
import MessagingUI from '../components/MessagingUI';

export default function Friends() {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'messaging'

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-200">Check-In</h1>
          
          <p className="text-gray-300 mt-4">Manage your safety network and stay connected</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'friends'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-black/30 text-gray-300 hover:text-white hover:bg-black/50 border border-gray-600'
            }`}
          >
            👥 Manage Friends
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'messaging'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-black/30 text-gray-300 hover:text-white hover:bg-black/50 border border-gray-600'
            }`}
          >
            💬 Safety Chat
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {activeTab === 'friends' ? (
            <FriendsList />
          ) : (
            <MessagingUI />
          )}
        </div>
      </div>
    </div>
  );
}
