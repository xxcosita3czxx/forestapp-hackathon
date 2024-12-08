import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';

const App = () => {
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

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
        // Fetching the chat history
        const response = await fetch(`http://127.0.0.1:8000/chat/fetchconvos/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          setError(`HTTP chyba: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Received Data:", data); // Debugging log

        // Fetch users based on the IDs in the chat history
        const userPromises = Object.keys(data).map(async (chatUserId) => {
          console.log(`Fetching user data for ID: ${chatUserId}`);

          // Checking if the userId is valid and exists
          if (!chatUserId) {
            console.error("Invalid user ID found:", chatUserId);
            return null;
          }

          const userResponse = await fetch(`http://127.0.0.1:8000/users/settings/set/${chatUserId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("User Data:", userData); // Debugging log

            // Checking if the response contains the 'general' and 'name' fields
            if (userData && userData.general && userData.general.name) {
              return { userId: chatUserId, username: userData.general.name };
            } else {
              console.error(`Chybí data pro uživatele ${chatUserId}`);
              return null;
            }
          } else {
            console.error(`HTTP chyba u uživatele ${chatUserId}: ${userResponse.status}`);
            return null;
          }
        });

        // Filter out null values (users with missing or invalid data)
        const userList = (await Promise.all(userPromises)).filter(user => user !== null);
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
            key={user.userId} // Use userId as key, not 'id'
            onClick={() => handleUserClick(user.userId)}
            className="user-button"
          >
            {user.username} {/* Display the user's name */}
          </button>
        ))
      )}
    </div>
  );
};

export default App;
