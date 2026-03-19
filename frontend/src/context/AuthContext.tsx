import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface User {
  id: string;
  email: string;
  child_name: string;
  child_age: number;
  avatar: {
    skin_color: string;
    hair_style: string;
    hair_color: string;
    outfit: string;
    accessory: string;
  };
  subscription_status: string;
  trial_end_date?: string;
  stars: number;
  level: number;
  badges: string[];
  completed_missions: string[];
  discovered_patterns: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, childName: string, childAge: number) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateAvatar: (avatar: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/status`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    const { token: newToken, user: userData } = response.data;
    await AsyncStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const signup = async (email: string, password: string, childName: string, childAge: number) => {
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      email,
      password,
      child_name: childName,
      child_age: childAge
    });
    const { token: newToken, user: userData } = response.data;
    await AsyncStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  const updateAvatar = async (avatar: any) => {
    if (!token) return;
    
    await axios.post(`${API_URL}/api/user/avatar`, avatar, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (user) {
      setUser({ ...user, avatar });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refreshUser, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
