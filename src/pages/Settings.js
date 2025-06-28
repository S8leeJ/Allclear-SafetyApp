import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, updateUser, getAuthHeaders } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSettingsChange = (setting) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // Redirect to sign out or home page
        window.location.href = '/signin';
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Failed to delete account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'account', name: 'Account', icon: '⚙️' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500 text-green-300' 
            : 'bg-red-500/20 border-red-500 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-black/30 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-black/50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-black/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-black/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-black/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive updates and notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accountSettings.emailNotifications}
                  onChange={() => handleAccountSettingsChange('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Push Notifications</h3>
                <p className="text-gray-400 text-sm">Receive push notifications in your browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accountSettings.pushNotifications}
                  onChange={() => handleAccountSettingsChange('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accountSettings.twoFactorAuth}
                  onChange={() => handleAccountSettingsChange('twoFactorAuth')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-black/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Account Management</h2>
          <div className="space-y-6">
            <div className="p-4 bg-black/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">Account Information</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="text-gray-300">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p><span className="text-gray-300">Last login:</span> {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
                <p><span className="text-gray-300">Account status:</span> <span className="text-green-400">Active</span></p>
              </div>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  