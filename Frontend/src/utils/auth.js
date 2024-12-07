// src/utils/auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('userToken');
  return !!token;
};

