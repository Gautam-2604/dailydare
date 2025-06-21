import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('user'),
      ]);
      console.log(storedToken, "Tokne");
      console.log("User", storedUser);
      
      

      if (storedUser) {
        setState({
          user: JSON.parse(storedUser),
          token: storedToken,
          isLoading: false,
        });
      } else {
        setState({ ...state, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setState({ ...state, isLoading: false });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('https://dailydare-backend-2.onrender.com/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Store both token and user data consistently
      await Promise.all([
        AsyncStorage.setItem('authToken', data.data.token),
        AsyncStorage.setItem('user', JSON.stringify(data.data.user))
      ]);

      // Set state unconditionally with correct data structure
      setState({
        user: data.data.user,
        token: data.data.token,
        isLoading: false,
      });
      
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, username: string, password: string) => {
    try {
      const response = await fetch('https://dailydare-backend-2.onrender.com/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();
      console.log(data, "Data");
      

      if (!response.ok) {
        throw new Error(data.message);
      }

      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(data.user)),
      ]);

      setState({
        user: data.user,
        token: data.token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('authToken'),
        AsyncStorage.removeItem('user'),
      ]);

      setState({
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('https://dailydare-backend-2.onrender.com/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await AsyncStorage.setItem('authToken', data.token);

      setState({
        ...state,
        token: data.token,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      await signOut();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        refreshToken,
      }}
    >
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