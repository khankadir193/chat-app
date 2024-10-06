import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css'; // for styling

// Connect to the backend server
const socket = io('http://localhost:5000');

const ChatComp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.off('chat message');  // Stop listening for messages
      socket.disconnect();         // Disconnect the socket
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Emit the message to the server
      socket.emit('chat message', message);
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComp;
