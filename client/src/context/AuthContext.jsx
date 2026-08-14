import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('codesolver_token');
        if (token) {
          const res = await api.auth.me();
          if (res && res.user) {
            setUser(res.user);
          }
        }
      } catch (err) {
        console.error('Session expired or not logged in:', err.message);
        localStorage.removeItem('codesolver_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.token) {
      localStorage.setItem('codesolver_token', res.token);
    }
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.auth.register({ name, email, password });
    if (res.token) {
      localStorage.setItem('codesolver_token', res.token);
    }
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('codesolver_token');
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
