import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bell, 
  MessageCircle, 
  UserPlus, 
  Calendar, 
  Briefcase, 
  Settings,
  X,
  Check,
  Trash2
} from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'request': return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'event': return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'job': return <Briefcase className="w-5 h-5 text-orange-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl`}>
        <div className={`p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h2>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className={`p-1 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                No notifications
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    !notification.read 
                      ? isDark ? 'bg-gray-700' : 'bg-blue-50'
                      : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                            {notification.message}
                          </p>
                          {notification.fromUser && (
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                {notification.fromUser.avatar ? (
                                  <img 
                                    src={notification.fromUser.avatar} 
                                    alt={notification.fromUser.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <span className="text-xs text-white font-medium">
                                    {notification.fromUser.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {notification.fromUser.name}
                              </span>
                            </div>
                          )}
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className={`p-1 ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'} transition-colors`}
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className={`p-1 ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                            title="Remove notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;