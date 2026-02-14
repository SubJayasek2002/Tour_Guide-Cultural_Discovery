import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  favoriteDestinationIds?: string[];
  favoriteEventIds?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    const response = await authAPI.login({ usernameOrEmail, password });
    setAuthToken(response.token);
    // Fetch full user (includes favorites)
    await refreshUser();
  };

  const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    await authAPI.signup(userData);
    await login(userData.username, userData.password);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
