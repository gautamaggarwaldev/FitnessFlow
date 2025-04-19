import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

// Define a default user context value instead of undefined
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  updateUserStats: (stats: Partial<User>) => void;
  logout: () => void;
  loading: boolean;
}

// Create a default implementation that will be used if the context is accessed outside a provider
const defaultUserContext: UserContextType = {
  user: null,
  setUser: () => console.warn("UserContext not initialized: setUser called outside provider"),
  updateUserStats: () => console.warn("UserContext not initialized: updateUserStats called outside provider"),
  logout: () => console.warn("UserContext not initialized: logout called outside provider"),
  loading: false
};

// Initialize the context with the default value
const UserContext = createContext<UserContextType>(defaultUserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      console.log('UserContext: Checking for stored user data');
      const storedUser = localStorage.getItem('beatburn-user');
      
      if (storedUser) {
        console.log('UserContext: Found stored user data, parsing');
        const parsedUser = JSON.parse(storedUser);
        console.log('UserContext: Setting user state with', parsedUser);
        setUserState(parsedUser);
      } else {
        console.log('UserContext: No stored user data found');
      }
    } catch (e) {
      console.error('UserContext: Failed to parse stored user data:', e);
    } finally {
      console.log('UserContext: Setting loading to false');
      setLoading(false);
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('beatburn-user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to store user data:', e);
      }
    }
  }, [user]);

  const setUser = (newUser: User) => {
    try {
      console.log('UserContext: Setting new user', newUser);
      setUserState(newUser);
      
      // Also update localStorage directly to ensure synchronization
      localStorage.setItem('beatburn-user', JSON.stringify(newUser));
      
      console.log('UserContext: User set successfully');
    } catch (e) {
      console.error('UserContext: Error setting user:', e);
    }
  };

  const updateUserStats = (stats: Partial<User>) => {
    try {
      setUserState(prev => prev ? { ...prev, ...stats } : null);
    } catch (e) {
      console.error('Error updating user stats:', e);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('beatburn-user');
      setUserState(null);
    } catch (e) {
      console.error('Error during logout:', e);
    }
  };

  // Create the context value object
  const contextValue: UserContextType = {
    user,
    setUser,
    updateUserStats,
    logout,
    loading
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
