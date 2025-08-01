import React, { createContext, useState, useEffect, useCallback } from 'react';
import { register as registerUser, login as loginUser, getCurrentUser, setAuthToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This useEffect runs once to set the initial token in axios
  // The interceptor in api.js will handle future token updates automatically
  useEffect(() => {
    setAuthToken(token); // Set the initial token from localStorage
  }, [token]);

  // Load user
  const loadUser = useCallback(async () => {
    if (token) {
      try {
        const res = await getCurrentUser();
        setUser(res.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', err);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null); // Clear token from localStorage via service
      }
    }
    setLoading(false);
  }, [token]);

  // Register user
  const register = useCallback(async (formData) => {
    try {
      const res = await registerUser(formData);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      setAuthToken(res.token); // Store token in localStorage via service
      setError(null);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  }, []);

  // Login user
  const login = useCallback(async (formData) => {
    try {
      const res = await loginUser(formData);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      setAuthToken(res.token); // Store token in localStorage via service
      setError(null);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null); // Clear token from localStorage via service
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};