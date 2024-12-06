import { useState, useEffect } from 'react'
import './chat.css'

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const fetchMessages = async () => {
    try {
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
        <button onClick={() => { sendMessage(); sendMessageToBackend(); }}>Odeslat</button>
      </div>
    </div>
  );
};

function createMessage(Type, content, recipientid, senderid) {
  return {
    type,
    content,
    recipientid,
    senderid
  };
}
var client_id = Date.now();
var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);

const sendMessageToBackend = () => {
  if (!inputMessage.trim()) return;

  const messageToChange = createMessage("Message", inputMessage, "recipientid", "senderid");
  const jsonMessage = JSON.stringify(messageToChange, null, 2);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(jsonMessage);
    console.log("Message sent:", jsonMessage); 
  } else {
    console.error("WebSocket is not open");
  }
};

ws.onmessage = function(event) {
  const messageObject = JSON.parse(event.data);
  const recipientidRecieved = JSON.parse(messageObject.recipientid); 
  const contentRecieved = JSON.parse(messageObject.content);  
  sendMessage();
}

export default App