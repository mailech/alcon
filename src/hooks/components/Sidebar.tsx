import React from 'react';
import { User } from '../types';
import { postTags } from '../data/colleges';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Users, Briefcase, Calendar, Search, TrendingUp, Award, MessageCircle, Share2 } from 'lucide-react';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeTab, 
  onTabChange, 
  selectedTags, 
  onTagToggle 
}) => {
  const { isDark } = useTheme();
  
  const studentMenuItems = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'mentorship', label: 'Mentorship', icon: MessageCircle },
    { id: 'jobs', label: 'Job Board', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  const alumniMenuItems = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'mentorship', label: 'Mentorship', icon: MessageCircle },
    { id: 'opportunities', label: 'Share Opportunities', icon: Share2 },
    { id: 'jobs', label: 'Job Board', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  const menuItems = user.role === 'student' ? studentMenuItems : alumniMenuItems;

  return (
    <div className={`w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-r min-h-screen transition-colors`}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Navigation
          </h2>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300'
                      : isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === 'feed' && (
          <div className="mb-6">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
              Filter by Tags
            </h3>
            <div className="space-y-2">
              {postTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTags.includes(tag.id)
                      ? tag.color
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  #{tag.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`bg-gradient-to-r ${isDark ? 'from-gray-700 to-gray-600' : 'from-blue-50 to-indigo-50'} rounded-lg p-4 transition-colors`}>
          <div className="flex items-center space-x-2 mb-2">
            <Award className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Profile
            </h3>
          </div>
          <div className={`space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <p><span className="font-medium">Role:</span> {user.role}</p>
            <p><span className="font-medium">Department:</span> {user.department}</p>
            <p><span className="font-medium">Batch:</span> {user.batch}</p>
            {user.currentPosition && (
              <p><span className="font-medium">Position:</span> {user.currentPosition}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;