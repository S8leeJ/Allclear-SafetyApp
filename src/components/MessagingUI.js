import React, { useState } from 'react';

export default function MessagingUI() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'messages'

  // Demo data
  const demoFriends = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Safe', avatar: 'S', lastSeen: '2 min ago' },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', status: 'In Risk Zone', avatar: 'M', lastSeen: '5 min ago' },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', status: 'Safe', avatar: 'E', lastSeen: '1 hour ago' },
    { id: 4, name: 'Alex Rodriguez', email: 'alex@example.com', status: 'Emergency', avatar: 'A', lastSeen: 'Just now' },
  ];

  const demoMessages = {
    1: [
      { id: 1, sender: 'Sarah Johnson', text: 'Hey! Are you okay? I saw the weather alert.', timestamp: '2:30 PM', isMe: false },
      { id: 2, sender: 'You', text: 'Yes, I\'m safe! Thanks for checking in.', timestamp: '2:32 PM', isMe: true },
      { id: 3, sender: 'Sarah Johnson', text: 'Good to hear! Stay safe out there.', timestamp: '2:33 PM', isMe: false },
    ],
    2: [
      { id: 1, sender: 'Mike Chen', text: 'I\'m in the evacuation zone. Heading to the shelter now.', timestamp: '1:45 PM', isMe: false },
      { id: 2, sender: 'You', text: 'Be careful! Let me know when you get there safely.', timestamp: '1:47 PM', isMe: true },
    ],
    3: [
      { id: 1, sender: 'Emma Davis', text: 'How\'s everything going on your end?', timestamp: '12:20 PM', isMe: false },
      { id: 2, sender: 'You', text: 'All good here! How about you?', timestamp: '12:22 PM', isMe: true },
      { id: 3, sender: 'Emma Davis', text: 'Same here. Just wanted to check in.', timestamp: '12:25 PM', isMe: false },
    ],
    4: [
      { id: 1, sender: 'Alex Rodriguez', text: '🚨 EMERGENCY: Need immediate assistance!', timestamp: '3:15 PM', isMe: false },
      { id: 2, sender: 'You', text: 'I\'m calling emergency services right now!', timestamp: '3:16 PM', isMe: true },
    ]
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedFriend) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText, 'to:', selectedFriend.name);
      setMessageText('');
    }
  };

  return (
    <div className="bg-black/30 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-black/40 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'friends' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👥 Friends
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'messages' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💬 Messages
            </button>
          </div>
          <div className="text-white font-semibold">Safety Network Chat</div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Friends List Sidebar */}
        <div className={`w-1/3 border-r border-gray-700 ${activeTab === 'friends' ? 'block' : 'hidden'}`}>
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4">Your Friends</h3>
            <div className="space-y-2">
              {demoFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedFriend?.id === friend.id 
                      ? 'bg-blue-600/20 border border-blue-500' 
                      : 'bg-black/20 hover:bg-black/40 border border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {friend.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium truncate">{friend.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(friend.status)}`}>
                          {getStatusIcon(friend.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">{friend.lastSeen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 flex flex-col ${activeTab === 'messages' ? 'block' : 'hidden'}`}>
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 bg-black/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {selectedFriend.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedFriend.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedFriend.status)}`}>
                        {getStatusIcon(selectedFriend.status)} {selectedFriend.status}
                      </span>
                      <span className="text-gray-400 text-xs">• {selectedFriend.lastSeen}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {demoMessages[selectedFriend.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isMe
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isMe ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700 bg-black/20">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-400 text-lg mb-2">Select a friend to start messaging</p>
                <p className="text-gray-500 text-sm">Choose from your safety network to send messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 