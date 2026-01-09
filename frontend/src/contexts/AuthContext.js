// frontend/src/contexts/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a app, verifica se já tem user no localStorage
    const recoveredUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (recoveredUser && token) {
      setUser(recoveredUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    
    // Salva no estado e no localStorage
    const loggedUser = response.user;
    localStorage.setItem('user', JSON.stringify(loggedUser));
    localStorage.setItem('token', response.token);
    
    setUser(loggedUser);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);