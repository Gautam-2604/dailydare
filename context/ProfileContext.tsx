import { UserLevel } from '@/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface ProfileState {
  bio: string;
  streak: number;
  totalPoints: number;
  friendsConnected: number;
  daresCompleted: number
  level: UserLevel;
    notifications: boolean;
    soundEffects: boolean;
    darkMode: boolean;
    publicProfile: boolean;
    friendRequests: boolean;
    challengeReminders: boolean;
    weeklyReport: boolean;
    dataSync: boolean;
  
}

interface ProfileContextType {
  profile: ProfileState;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<ProfileState>) => Promise<void>;
  updateSettings: (key: keyof Pick<ProfileState, 'notifications' | 'soundEffects' | 'darkMode' | 'publicProfile' | 'friendRequests' | 'challengeReminders' | 'weeklyReport' | 'dataSync'>, value: boolean) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, ...state } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileState>({
    bio: '',
    streak: 0,
    totalPoints: 0,
    level: UserLevel.Beginner,
    friendsConnected: 0,
    daresCompleted: 0, 
      notifications: true,
      soundEffects: true,
      darkMode: true,
      publicProfile: true,
      friendRequests: true,
      challengeReminders: true,
      weeklyReport: false,
      dataSync: true,
    
  });

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`https://dailydare-backend-2.onrender.com/api/v1/profile/${state.user?.id}`, {
        method:'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setProfile(data);
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error refreshing profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
        // Then refresh from backend
        await refreshProfile();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error('Error initializing profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      initializeProfile();
    }
  }, [token]);

  const updateProfile = async (updates: Partial<ProfileState>) => {
    try {
      setError(null);
      // Optimistic update
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));

      const response = await fetch(`https://dailydare-backend-2.onrender.com/api/v1/user/profile/${state.user?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // Rollback on failure
        setProfile(profile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateSettings = async (
    key: keyof Pick<ProfileState, 'notifications' | 'soundEffects' | 'darkMode' | 'publicProfile' | 'friendRequests' | 'challengeReminders' | 'weeklyReport' | 'dataSync'>,
    value: boolean
  ) => {
    try {
      setError(null);
      // Optimistic update
      const newProfile = {
        ...profile,
        [key]: value
      };
      setProfile(newProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));

      const response = await fetch(`https://dailydare-backend-2.onrender.com/api/v1/user/profile/${state.user?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        // Rollback on failure
        setProfile(profile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      setProfile(data);
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        updateProfile,
        updateSettings,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};