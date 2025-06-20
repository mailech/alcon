import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('alumni-connect-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure new fields have default values
      const updatedUser: User = {
        ...parsedUser,
        followers: parsedUser.followers || [],
        following: parsedUser.following || [],
        friends: parsedUser.friends || [],
        skills: parsedUser.skills || [],
        interests: parsedUser.interests || [],
        achievements: parsedUser.achievements || [],
        languages: parsedUser.languages || [],
        profileVisibility: parsedUser.profileVisibility || 'college',
        contactVisibility: parsedUser.contactVisibility || 'college'
      };
      setUser(updatedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    const userWithDefaults: User = {
      ...userData,
      followers: userData.followers || [],
      following: userData.following || [],
      friends: userData.friends || [],
      skills: userData.skills || [],
      interests: userData.interests || [],
      achievements: userData.achievements || [],
      languages: userData.languages || [],
      profileVisibility: userData.profileVisibility || 'college',
      contactVisibility: userData.contactVisibility || 'college'
    };
    setUser(userWithDefaults);
    localStorage.setItem('alumni-connect-user', JSON.stringify(userWithDefaults));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alumni-connect-user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('alumni-connect-user', JSON.stringify(updatedUser));
    }
  };

  return { user, login, logout, updateUser, loading };
};