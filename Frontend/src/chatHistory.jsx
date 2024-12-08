import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';

const App = () => {
  const [conversations, setConversations] = useState([]); // List of conversations
  const [users, setUsers] = useState([]); // List of user details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Fetch chat history and get userIds directly
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        setError("userId není nastaven v localStorage.");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching chat history...');
        // Fetching the chat history
        const response = await fetch(`http://127.0.0.1:8000/chat/fetchconvos/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          console.error(`HTTP chyba při fetching chat history: ${response.status}`);
          setError(`HTTP chyba: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Received Data:", data); // Log the full response to inspect the structure

        // Assuming data is an object with a 'name' field and it corresponds to a userId
        const conversations = data.name ? [{
          userId: data.name, // Directly using the 'name' as userId
        }] : [];

        console.log("Extracted Conversations:", conversations); // Log the extracted conversations

        // Fetch user details for each conversation
        console.log('Fetching user details for each conversation...');
        const userResponses = await Promise.all(conversations.map(async (conv) => {
          console.log(`Fetching user details for ${conv.userId}`);
          const userResponse = await fetch(`http://127.0.0.1:8000/users/fetch/${conv.userId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!userResponse.ok) {
            console.error(`Error fetching user details for ${conv.userId}: ${userResponse.status}`);
            return null;
          }

          const userData = await userResponse.json();
          console.log(`User data for ${conv.userId}:`, userData);

          return {
            userId: conv.userId,
            userName: userData.general ? userData.general.name : 'Unknown User',
            email: userData.general ? userData.general.email : 'No email',
          };
        }));

        // Filter out null values in case some user data was not fetched
        const validUsers = userResponses.filter(user => user !== null);
        console.log("Valid Users:", validUsers); // Log valid user responses
        setUsers(validUsers);
        setConversations(conversations);

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
        users.length > 0 ? (
          users.map((user) => (
            <button
              key={user.userId} // Use user ID as key
              onClick={() => handleUserClick(user.userId)}
              className="user-button"
            >
              {user.userName} {/* Display the user name */}
            </button>
          ))
        ) : (
          <p>No conversations found.</p>
        )
      )}
    </div>
  );
};

export default App;
