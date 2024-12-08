import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';

const App = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("userId is not set in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/chat/fetchconvos/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          setError(`HTTP error: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const conversations = data.name ? [{ userId: data.name }] : [];
        console.log(data);

        const userResponses = await Promise.all(conversations.map(async (conv) => {
          console.log(`Fetching user details for ${conv.userId}`);
          const userResponse = await fetch(`http://127.0.0.1:8000/users/fetch/${conv.userId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });

          if (!userResponse.ok) return null;

          const userData = await userResponse.json();
          return {
            userId: conv.userId,
            userName: userData.general ? userData.general.name : 'Unknown User',
            email: userData.general ? userData.general.email : 'No email',
          };
        }));

        const validUsers = userResponses.filter(user => user !== null);
        setUsers(validUsers);
        setConversations(conversations);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUserClick = (userId) => {
    navigate('/chat', { state: { userId } });
  };

  const handleAddConfirm = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/fetch/${searchQuery}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const userData = await response.json();
      const userExists = users.some(user => user.userId === userData.uuid);
      
      if (!userExists) {
        const newUser = {
          userId: userData.uuid,
          userName: userData.general ? userData.general.name : 'Unknown User',
          email: userData.general ? userData.general.email : 'No email'
        };
        
        // Add the new user to the current user's connections
        await editUserConnections(userId, newUser.userId);
        
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const editUserConnections = async (currentUserId, newUserId) => {
    try {
      const editResponse = await fetch(
        `http://127.0.0.1:8000/users/edit/${currentUserId}&messages&name1&${newUserId}`, 
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!editResponse.ok) {
        throw new Error(`Failed to edit user connections: ${editResponse.status}`);
      }
    } catch (err) {
      console.error('Error editing user connections:', err);
      // Optionally, you might want to show an error to the user
      setError(err.message);
    }
  };

  return (
    <div>
      <div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={handleAddConfirm}>Confirm</button>
      </div>

      {loading ? (
        <p className="loading-text">Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        users.length > 0 ? (
          users.map((user) => (
            <button
              key={user.userId}
              onClick={() => handleUserClick(user.userId)}
              className="user-button"
            >
              {user.userName}
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