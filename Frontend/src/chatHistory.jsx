import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';

const App = () => {
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem("token")
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        setError("userId není nastaven v localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/chat/fetchconvos/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }});

        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          setError(`HTTP chyba: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Received Data:", data);

        // Fetch usernames for each user ID
        const userPromises = Object.keys(data).map(async (id) => {
          const userResponse = await fetch(`http://127.0.0.1:8000/users/etting/set/${id}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }});

          if (userResponse.ok) {
            const userData = await userResponse.json();
            return { id, username: userData.general.name }; // Extract `username` from the response
          } else {
            console.error(`HTTP chyba u uživatele ${id}: ${userResponse.status}`);
            return null;
          }
        });

        const userList = (await Promise.all(userPromises)).filter((user) => user !== null);
        console.log("User List:", userList);

        setUsers(userList);
      } catch (err) {
        console.error('Chyba při načítání dat:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle user click to navigate to chat page
  const handleUserClick = (userId) => {
    console.log(`User ${userId} clicked`);
    navigate('/chat', { state: { userId } });
  };

  return (
    <div>
      {loading ? (
        <p className="loading-text">Načítám data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            className="user-button"
          >
            {user.username}
          </button>
        ))
      )}
    </div>
  );
};

export default App;
