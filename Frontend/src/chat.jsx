import { useState, useEffect } from 'react';
import { FaPaperPlane, FaArrowLeft, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './chat.css';
import { fetchAuth } from './utils/auth';

const App = () => {
  const { username } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [color, setColor] = useState('chat-page-dark');
  const [showOverlay, setShowOverlay] = useState(false);
  const [name, setName] = useState('User Name');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchColor = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetchAuth(`http://127.0.0.1:8000/users/settings/set/${userId}`, {
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
    const fetchOtherUsers = async () => {
      if (username) {
        console.error("username není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetchAuth(`http://127.0.0.1:8000/users/fetchAuthAuthAuthAuthAuthAuth/${username}`, {
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
  
        const otherUserId = data.userId || 'default';
        console.log('otherUserId:', userId);
  
      } catch (error) {
        console.error('Error fetching otherUserId:', error);
      }
    };
  
    fetchOtherUsers();
  }, [username]); // Závislost na `userId`

  useEffect(() => {
    const fetchTextHistory = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/chat/fetchconvos/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json();
        console.log('Response Data:', data);
  
        // Filtrovat zprávy podle `otherUserId`
        const filteredMessages = Object.entries(data)
          .filter(([key]) => key === otherUserId) // Filtr podle `otherUserId`
          .flatMap(([_, messages]) => JSON.parse(`[${messages}]`)) // Parsování zpráv
          .sort((a, b) => a.time - b.time); // Řazení zpráv podle času
  
        setMessages(filteredMessages); // Nastavit zprávy
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };
  
    fetchTextHistory();
  }, [userId, otherUserId]); // Závislost na `userId` a `otherUserId`


  useEffect(() => {
    
    var socket = new WebSocket(`ws://127.0.0.1:8000/ws/ws`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const messageObject = JSON.parse(event.data);
        const recipientid = messageObject.recipientid;
        const content = messageObject.content;
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: content, isOwnMessage: false },
        ]);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageToSend = {
        type: 'Message',
        content: inputMessage,
        recipientid: 'recipientid',
        senderid: 'senderid'
      };
      ws.send(JSON.stringify(messageToSend));
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, isOwnMessage: true },
    ]);
    setInputMessage('');
  };

  const changeBackgroundColor = (input) => {
    setColor(input); 
  };

  const handleEditName = () => {
    if (isEditing) {
      setName(newName);  
      console.log('Name has been changed');
    }
    setIsEditing(!isEditing);  
  };

  const changeHelpStatus = () => {
    wantToHelp = !wantToHelp;
  };

  return (
    <div className={color}>
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1>Chat</h1>
        {/*<button 
          className="settings-button" 
          onClick={() => setShowOverlay(!showOverlay)}
        >
          <FaCog />
        </button>*/}
      </div>

      {showOverlay && (
        <div className="overlay">
          {/*<div className="color-toggle">
            <button onClick={() => changeBackgroundColor('chat-page-pink')}>Pink</button>
            <button onClick={() => changeBackgroundColor('chat-page-green')}>Green</button>
            <button onClick={() => changeBackgroundColor('chat-page-blue')}>Blue</button>
            <button onClick={() => changeBackgroundColor('chat-page-dark')}>Dark</button>
            <button onClick={() => changeHelpStatus()}>Help</button>
          </div>*/}
          {/*<div className="name-container">
            <div className="name-display">
              {isEditing ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                />
              ) : (
                <span>{name}</span>
              )}
            </div>
            <button onClick={handleEditName}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>*/}
        </div>
      )}

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`message-wrapper ${msg.role === 'recipient' ? 'other-message' : 'own-message'}`}
          >
            <div className="message">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Napište zprávu..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          className="send-button"
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default App;
