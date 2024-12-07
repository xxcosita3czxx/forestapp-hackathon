// src/utils/auth.js
export const isAuthenticated = () => {
  const sessionId = localStorage.getItem('sessionId');
  const userId = localStorage.getItem('userId');
  return sessionId && userId;
};

export const verifySession = async () => {
  const sessionId = localStorage.getItem('sessionId');
  const userId = localStorage.getItem('userId');
  
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
