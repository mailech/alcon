import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export interface Notification {
  id: string;
  type: 'message' | 'request' | 'event' | 'job' | 'system';
  title: string;
  message: string;
  fromUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  data?: any;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode; user: User | null }> = ({ 
  children, 
  user 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications-${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        setNotifications(parsed);
      }
    }
  }, [user]);

  const saveNotifications = (newNotifications: Notification[]) => {
    if (user) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(newNotifications));
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};