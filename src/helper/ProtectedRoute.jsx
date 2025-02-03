import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const tokenExpiry = localStorage.getItem('tokenExpiry');

  if (!token || (tokenExpiry && Date.now() > parseInt(tokenExpiry, 10))) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
