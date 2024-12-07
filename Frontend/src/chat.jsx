import { useState, useEffect } from 'react';
import { FaPaperPlane, FaArrowLeft, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './chat.css';

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
            className={`message-wrapper ${msg.isOwnMessage ? 'own-message' : 'other-message'}`}
          >
            <div className="message">
              {msg.text}
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
