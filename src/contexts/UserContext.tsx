
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'offline';
  joinedRooms: number[];
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  isProfileComplete: boolean;
}

const defaultProfile: UserProfile = {
  username: 'guest',
  displayName: 'Guest User',
  avatarUrl: '',
  status: 'online',
  joinedRooms: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('user-profile', defaultProfile);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(current => ({ ...current, ...updates }));
  };

  const isProfileComplete = userProfile.username !== 'guest' && Boolean(userProfile.displayName);

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, isProfileComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
