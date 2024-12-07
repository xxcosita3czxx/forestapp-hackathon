import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PrivateRoute from './utils/privateroute';
import Home from './home';
import Login from './login';

export default function App() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      setIsAuth(!!token);
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuth ? <Home /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={isAuth ? <Navigate to="/" replace /> : <Login />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
