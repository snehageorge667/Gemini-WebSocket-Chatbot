import React, { useState } from "react";
import { FaPaperPlane, FaTimes, FaTrash } from "react-icons/fa";
import "./ChatBox.css";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const MODEL_API_URL = "http://127.0.0.1:5000/chat";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(MODEL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMsg = {
        sender: "bot",
        text: data.response || "No response from server.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to backend." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => setMessages([]);
  const closeChat = () => setOpen(false);

  return (
    <div className="chat-container">
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chat-window">
          {/* HEADER */}
          <div className="chat-header">
            <h3>Gemini Chatbot</h3>
            <div className="header-buttons">
              <FaTrash title="Clear chat" onClick={clearChat} />
              <FaTimes title="Close chat" onClick={closeChat} />
            </div>
          </div>

          {/* MESSAGES */}
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user-message" : "bot-message"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="input-area">
            <input
              type="text"
              placeholder="Type here…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <FaPaperPlane className="send-icon" onClick={sendMessage} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
