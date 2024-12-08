import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';
import Navbar from './components/navbar'; // Add import

const ChatHistory = () => {
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

        const userResponses = await Promise.all(conversations.map(async (conv) => {
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
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chat-history-page">
      <div className="chat-history-content">
        <div className="search-container">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Vyhledat uživatele..."
            className="search-input"
          />
          <button 
            onClick={handleAddConfirm}
            className="search-button"
          >
            Přidat
          </button>
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
      
      <Navbar /> {/* Add navbar at bottom */}
    </div>
  );
};

export default ChatHistory;