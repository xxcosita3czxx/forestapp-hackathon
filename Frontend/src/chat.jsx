import { useState, useEffect } from 'react';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import './chat.css';

const Chat = () => {
  const { username } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem("token");

  // Fetch color theme from the backend
  useEffect(() => {
    const fetchColor = async () => {
      if (!userId) {
        console.error("userId není nastaven v localStorage.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8000/users/settings/set/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json();
        console.log('Response Data:', data);
  
        const theme = data.theme || 'default';
        setColor(theme); // Nastavit barvu na základě odpovědi
  
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchColor();
  }, [userId]);

  // Fetch other user's data
  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (!username) {
        console.error("username není nastaven.");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8000/users/fetch/${username}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json();
        setOtherUserId(data.userId || 'default');
        console.log('otherUserId:', data.userId);
  
      } catch (error) {
        console.error('Error fetching otherUserId:', error);
      }
    };
  
    fetchOtherUsers();
  }, [username]);

  // Fetch conversation history
  useEffect(() => {
    const fetchTextHistory = async () => {
      if (!userId || !otherUserId) {
        console.error("userId nebo otherUserId není nastaven.");
        return;
      }
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/chat/fetchconvos/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error(`HTTP chyba: ${response.status}`);
          return;
        }
  
        const data = await response.json();
        console.log('Response Data:', data);
  
        const filteredMessages = Object.entries(data)
          .filter(([key]) => key === otherUserId)
          .flatMap(([_, messages]) => JSON.parse(`[${messages}]`))
          .sort((a, b) => a.time - b.time);
  
        setMessages(filteredMessages);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };
  
    fetchTextHistory();
  }, [userId, otherUserId]);

  // WebSocket setup
  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/chat/ws`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const messageObject = JSON.parse(event.data);
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
        recipientid: otherUserId,
        senderid: userId
      };
      ws.send(JSON.stringify(messageToSend));
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, isOwnMessage: true },
    ]);
    setInputMessage('');
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1>Chat s {username}</h1>
      </div>

      <div className="chat-content">
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
      
      <Navbar />
    </div>
  );
};

export default Chat;
