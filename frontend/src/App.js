import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

// Connect to backend WebSocket
const socket = io("http://localhost:5000");

function App() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    socket.on("bot_message", (data) => {
      setTyping(true);
      setTimeout(() => {
        setChat((prev) => [...prev, { sender: "bot", text: data.reply }]);
        setTyping(false);
      }, 600); // simulate typing delay
    });
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socket.emit("user_message", { message: msg });
    setChat((prev) => [...prev, { sender: "user", text: msg }]);
    setMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => setChat([]);

  return (
    <>
      {/* Floating Chat Bubble */}
      {!open && (
        <div className="chat-bubble bounce" onClick={() => setOpen(true)}>
          💬
        </div>
      )}

      {/* Chat Box */}
      {open && (
        <div className="chat-box slide-up">
          <div className="header">
            <span>Gemini Chatbot</span>
            <div>
              <button className="clear-btn" onClick={clearChat}>
                🗑️
              </button>
              <button className="close-btn" onClick={() => setOpen(false)}>
                ✖
              </button>
            </div>
          </div>

          <div className="messages">
            {chat.length === 0 && !typing && (
              <div className="bot">Hi! Type something to start chat.</div>
            )}
            {chat.map((c, index) => (
              <div
                key={index}
                className={c.sender === "user" ? "user" : "bot"}
              >
                {c.text}
              </div>
            ))}
            {typing && <div className="bot typing">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button className="send-btn" onClick={sendMessage}>
              📤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
