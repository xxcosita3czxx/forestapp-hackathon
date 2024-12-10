// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { verifySession } from './auth';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionId = localStorage.getItem('sessionId');
      const userId = localStorage.getItem('userId');

      if (!sessionId || !userId) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const isValid = await verifySession();
      
      if (!isValid) {
        // Clear invalid session data
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      }
      
      setIsAuthenticated(isValid);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;