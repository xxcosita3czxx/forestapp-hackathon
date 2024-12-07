import { useState, useEffect } from 'react';
import './chat.css';

const App = () => {
  const [messages, setMessages] = useState([]);  // Stores the list of messages to be displayed
  const [inputMessage, setInputMessage] = useState('');  // Stores the currently typed message

  const [ws, setWs] = useState(null);   // Holds the WebSocket connection

  useEffect(() => {
    var socket = new WebSocket(`ws://127.0.0.1:8000/ws/ws`);  // Establish WebSocket connection

    // This function is triggered once the WebSocket connection is established
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    // This function is triggered when a message is received from the WebSocket
    socket.onmessage = (event) => {
      try {
        const messageObject = JSON.parse(event.data);  // Parse the received JSON data
        const recipientid = messageObject.recipientid;
        const content = messageObject.content;
        console.log("Raw event data:", event.data);
        console.log(`Received message from ${recipientid}: ${content}`);

        // Adds the received message to the state (assuming it is from another user)
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: content, isOwnMessage: false },
        ]);
      } catch (error) {
        console.error("Failed to parse message:", event.data);
      }
    };

    // This function is triggered in case of a WebSocket error
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // This function is triggered when the WebSocket connection is closed
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Set the WebSocket connection in state
    setWs(socket);

    // Cleanup WebSocket connection when the component is unmounted
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;  // Do not send empty messages

    sendMessageToBackend(inputMessage);  // Sends the typed message to the backend

    // Adds the typed message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, isOwnMessage: true },
    ]);
    setInputMessage('');  // Clears the input field
  };

  // Function to send the message to the backend (via WebSocket)
  const sendMessageToBackend = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageToSend = createMessage('Message', message, 'recipientid', 'senderid');  // Create message object
      const jsonMessage = JSON.stringify(messageToSend);  // Convert message to JSON format

      ws.send(jsonMessage);  // Send the JSON message via WebSocket
      console.log("Message sent:", jsonMessage);
    } else {
      console.error("WebSocket is not open");
    }
  };

  // Helper function to create the message object
  function createMessage(type, content, recipientid, senderid) {
    return {
      type,
      content,
      recipientid,
      senderid,
    };
  }

  return (
    <div className="chat-container">   {/* Main container for the chat */}
      <div className="messages-list">   {/* Section for displaying messages */}
        {messages.map((msg, index) => (
          <div className={msg.isOwnMessage ? 'yourMessage' : 'theirMessage'}> {/* Conditional styling based on message sender */}
            <p>{msg.text}</p> {/* Display the message text */}
          </div>
        ))}
      </div>
      <div className="input-area">  {/* Input area for typing messages */}
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}  // Update the inputMessage state as user types
          placeholder="Napište zprávu..."  // Placeholder text
        />
        <button onClick={sendMessage}>Odeslat</button>  {/* Send message when clicked */}
      </div>
    </div>
  );
};

export default App;
