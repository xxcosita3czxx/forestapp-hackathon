import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';
import Navbar from './components/navbar'; // Add import

const ChatHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const userResponse = await fetch(`http://127.0.0.1:8000/users/fetch/${conv.userId}`, {
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
        console.log("dksajdhsfaghfdgshal");

        console.log("data is " +  data);
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

  useEffect(() => {
    const fetchTheme = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:8000/users/settings/set/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) return;

        const data = await response.json();
        const theme = data.settings.theme;

        // Apply theme
        const gradients = {
          PINK: 'linear-gradient(45deg, #FF55E3, #F3C1EE)',
          BLUE: 'linear-gradient(45deg, #55B4FF, #C1E4EE)',
          GREEN: 'linear-gradient(45deg, #55FF7E, #C1EED3)',
          BLACK: 'linear-gradient(45deg, #333333, #666666)'
        };

        document.body.style.background = gradients[theme];
        document.body.style.transition = 'background 0.3s ease';

      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
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
    <div className="chat-history-page">
      <div className="chat-history-content">
        <h1 className="chat-history-title">Chats</h1>
        
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
      
      <Navbar /> {/* Add navbar at bottom */}
    </div>
  );
};

export default ChatHistory;