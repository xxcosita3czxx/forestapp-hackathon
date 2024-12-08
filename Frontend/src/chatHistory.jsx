import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate between pages
import './chatHistory.css';

const App = () => {
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state for users
  const [error, setError] = useState(null); // To capture and display errors
  const navigate = useNavigate(); // Initialize the navigate function

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchColor = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/settings/set/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json(); // 
        console.log('Response Data:', data);
  
        const theme = data.theme || 'default';
        console.log('Theme:', theme);
  
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchColor();
  }, [userId]); // Závislost na `userId`

  useEffect(() => {
    
    // Fetch users from the /users/fetchall API endpoint using GET request
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/fetchall', {
          method: 'GET',
          headers: {
            'Accept': 'application/json', // Ensure that the response is in JSON format
          },
        });

        if (response.ok) {
          const textData = await response.text(); // Get the response as raw text
          console.log('Response Body (Text):', textData); // Log the raw text response

          const data = JSON.parse(textData); // Parse the response text to JSON

          // Convert the object to an array of user objects
          const usersArray = Object.values(data).map(user => ({
            id: user.general.name, // Assuming name is unique for each user
            username: user.general.name,
          }));

          setUsers(usersArray); // Set the users data in state
        } else {
          setError(`Failed to fetch users. Status: ${response.status}`);
        }

        setLoading(false); // Stop loading once data is received
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users. Please try again later.');
        setLoading(false); // Stop loading if error occurs
      }
    };

    fetchUsers(); // Call the fetchUsers function when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  const handleUserClick = (username) => {
    console.log(`${username} - Clicked`); // Log the username
    navigate('/chat', { state: { username } }); // Navigate to the chat page with username
  };

  return (
    <div>
      {loading ? (
        <p className="loading-text">Loading users...</p> // Apply loading-text class
      ) : error ? (
        <p className="error-message">{error}</p> // Apply error-message class
      ) : (
        users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleUserClick(user.username)} // Pass username to handleUserClick
            className="user-button" // Apply user-button class
          >
            {user.username}
          </button>
        ))
      )}
    </div>
  );
};

export default App;
