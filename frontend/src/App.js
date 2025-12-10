import React from "react";
import ChatBox from "./ChatBox";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* Optional header for the page */}
      <header className="App-header">
        <h1>Gemini Chatbot Application</h1>
      </header>

      {/* Floating ChatBox Component */}
      <ChatBox />
    </div>
  );
}

export default App;
