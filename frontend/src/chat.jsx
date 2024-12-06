import { useState, useEffect } from 'react'
import './chat.css'

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const fetchMessages = async () => {
    try {
      // Mock messages for demonstration
      const mockMessages = [
        { text: 'Hello' },
        { text: 'How are you?' }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, { text: inputMessage }]);
    setInputMessage('');
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Napište zprávu..."
        />
        <button onClick={sendMessage}>Odeslat</button>
      </div>
    </div>
  );
};

export default App