import { useState, useEffect } from 'react';
import './chat.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    sendMessageToBackend(inputMessage);

    setMessages([...messages, { text: inputMessage, isOwnMessage: true }]);
    setInputMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.isOwnMessage ? 'yourMessage' : 'theirMessage'}`}
          >
            <div className={msg.isOwnMessage ? 'yourMessage' : 'theirMessage'}>
              <p>{msg.text}</p>
            </div>
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

function createMessage(type, content, recipientid, senderid) {
  return {
    type,
    content,
    recipientid,
    senderid
  };
}

var client_id = Date.now();
var ws = new WebSocket(`ws://127.0.0.1:8000/ws/ws`);

const sendMessageToBackend = (inputMessage) => {
  console.log("sendMessageToBackend");
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
  const recipientidReceived = messageObject.recipientid;
  const contentReceived = messageObject.content;

  console.log(`Received message from ${recipientidReceived}: ${contentReceived}`);

  setMessages(prevMessages => [...prevMessages, { text: contentReceived, isOwnMessage: false }]);
};

export default App;
