import { useState, useEffect } from 'react'
import axios from 'axios'
import './chat.css'

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const fetchMessages = async () => {
    try {
      // Mock API call - replace with your actual backend endpoint
      const response = await axios.get('/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Chyba při načítání zpráv:', error);
      // Optional: Add mock messages for testing
      setMessages([
        { text: 'Test message 1' },
        { text: 'Test message 2' }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      // Mock API call - replace with your actual backend endpoint
      await axios.post('/api/messages', { text: inputMessage });
      setMessages([...messages, { text: inputMessage }]);
      setInputMessage('');
    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error);
      // Optimistically add message to UI
      setMessages([...messages, { text: inputMessage }]);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
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