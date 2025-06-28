import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (user) => {
    if (!user) return 'U';
    const { firstName, lastName } = user;
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    const { firstName, lastName } = user;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    return user.email || 'User';
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-sm border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src="/officiallogo.png"
            alt="AllClear Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-white">AllClear</h1>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/friends" 
            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors duration-200"
          >
            Friends
          </Link>
          <Link 
            to="/testing" 
            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors duration-200"
          >
            News
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getUserInitials(user)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{getUserDisplayName(user)}</p>
            <p className="text-gray-400 text-xs">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link 
            to="/settings" 
            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors duration-200 text-sm"
          >
            Settings
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors duration-200 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
