import React, { useState } from 'react';
import { User } from '../types';
import { colleges } from '../data/colleges';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  GraduationCap, 
  LogOut, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  MessageCircle,
  Settings,
  User as UserIcon
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  onSearch, 
  onOpenProfile,
  onOpenChat 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const college = colleges.find(c => c.id === user.college);

  return (
    <>
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Alumni Connect
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {college?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search posts, people, or topics..."
                  onChange={(e) => onSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Messages */}
              <button
                onClick={onOpenChat}
                className={`p-2 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Messages"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className={`relative p-2 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} capitalize`}>
                      {user.role}
                    </p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-50`}>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center space-x-2 w-full px-4 py-2 text-left ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center space-x-2 w-full px-4 py-2 text-left ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <hr className={`my-1 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center space-x-2 w-full px-4 py-2 text-left ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'} transition-colors`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Header;