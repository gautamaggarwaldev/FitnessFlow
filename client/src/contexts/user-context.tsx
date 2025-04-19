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
      const storedUser = localStorage.getItem('beatburn-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      }
    } catch (e) {
      console.error('Failed to parse stored user data:', e);
    } finally {
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
      setUserState(newUser);
    } catch (e) {
      console.error('Error setting user:', e);
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
