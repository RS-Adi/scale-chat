import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';

// Define the structure of a message
interface Message {
  id: string;
  text: string;
  sender: string;
}

// Connect to Backend (Port 4000)
const socket: Socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [myId, setMyId] = useState('');

  useEffect(() => {
    // 1. Listen for connection to get our ID
    socket.on('connect', () => {
      setMyId(socket.id || '');
      console.log('Connected as:', socket.id);
    });

    // 2. Listen for incoming messages
    socket.on('receive_message', (data: { message: string, senderId: string }) => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        text: data.message,
        sender: data.senderId
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    // 3. Cleanup listener on unmount (Good Practice!)
    return () => {
      socket.off('connect');
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      // Send to backend
      socket.emit('send_message', { message: input, senderId: socket.id });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <h1>ScaleChat 🚀</h1>

      <div className="message-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === myId ? 'my-message' : 'other-message'}`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
