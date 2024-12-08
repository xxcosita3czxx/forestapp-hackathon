// src/utils/auth.js
export const isAuthenticated = () => {
  const sessionId = localStorage.getItem('sessionId');
  const userId = localStorage.getItem('userId');
  return sessionId && userId;
};

export const verifySession = async () => {
  const sessionId = localStorage.getItem('sessionId');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (!sessionId || !userId) return false;

  try {
    const response = await fetch(`http://localhost:8000/auth/verify/${sessionId}&${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.status === 200;
  } catch (err) {
    console.error('Session verification failed:', err);
    return false;
  }
};

export const verifyAuth = async () => {
  try {
    const response = await fetch(`http://localhost:8000/auth/verify/${sessionId}&${userId}`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  } : {};
};

export const fetchAuth = async (url, options = {}) => {
  if (await verifyAuth()) {
    const headers = {
      ...getAuthHeader(),
      ...options.headers
    };
    
    return fetch(url, {
      ...options,
      headers
    });
  }
  
  throw new Error('Unauthorized');
};
