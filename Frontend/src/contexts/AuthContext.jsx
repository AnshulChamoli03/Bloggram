import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, isAuthenticated } from '../services/authService';
import { getMe } from '../services/userService';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  // Check for existing token and validate it on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (isAuthenticated()) {
        // Try to fetch user data to validate token
        const userData = await getMe();
        setUser(userData);
        setIsAuthenticatedState(true);
      } else {
        setUser(null);
        setIsAuthenticatedState(false);
      }
    } catch (error) {
      // Token is invalid or expired
      logoutService();
      setUser(null);
      setIsAuthenticatedState(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { user: userData } = await loginService(email, password);
      setUser(userData);
      setIsAuthenticatedState(true);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerService(userData);
      // After registration, automatically log in
      const loginResult = await login(userData.email, userData.password);
      return loginResult;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticatedState(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticatedState,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

