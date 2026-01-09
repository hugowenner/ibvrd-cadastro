// frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Carregando...</div>; // Ou um LoadingSpinner se tiver
  }

  if (!user) {
    // Se não logado, manda pro login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;