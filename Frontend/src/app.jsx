import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PrivateRoute from './utils/PrivateRoute';
import Home from './home';
import Login from './login';
import Chat from './chat';
import ChatHistory from './chatHistory';

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
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/chatHistory" 
          element={
            <PrivateRoute>
              <ChatHistory />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
