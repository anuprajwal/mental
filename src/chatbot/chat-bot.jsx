// src/components/ChatBot.jsx
import React, { useState, useEffect  } from 'react';
import './chat-bot.css';
import {url_domain} from "../App"

function ChatBot() {
  const defaultWelcomeMessage = {
    sender: 'bot',
    text: "Hello, I'm Ava. How are you feeling today?",
  };


  const [messages, setMessages] = useState([defaultWelcomeMessage]);
  const [chatHistory, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null);


  useEffect(() => {
    fetch(`${url_domain}/api/list/chats`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setChats(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  // Clear messages and start a new session
  const handleNewChat = () => {
    const now = new Date();

    const date = now.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    });

    const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    });

    const chatName = `Chat - ${date} @ ${time}`;

    console.log(chatName);

    const sendMessage = async (message) => {
        try {
          const response = await fetch(`${url_domain}/api/create-new-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });
      
          const data = await response.json();
        } catch (error) {
          console.error('Error sending message:', error);
        }
    };

    setActiveChat(chatName);

    sendMessage({
        chatName 
    })
      

    setMessages([defaultWelcomeMessage]);
  };

  const handleSend = () => {
    const input = document.getElementById('chat-input');
    const userText = input.value.trim();
    if (!userText) return;
    if (!activeChat) {
      console.warn("No active chat selected!");
      return;
    }

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);


    fetch(`${url_domain}/api/save-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userChat: userText,
        chatName: activeChat,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to save chat");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Chat saved:", data);

      if (data.ai_response) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.ai_response }]);
      }
    })
    .catch((err) => {
      console.error("Error saving chat:", err);
    });
    

    input.value = '';
  };

  const handleEnter = (e)=>{
    console.log(activeChat)
    if (!activeChat){
      console.log('returning')
      return
    }
    if (e.key === 'Enter') {
        e.preventDefault(); 
        handleSend();  
    }
  }


  const openChatDetails = async (chatId) => {
    console.log("Opening chat:", activeChat);
    setActiveChat(chatId);
  
    try {
      const res = await fetch(`${url_domain}/api/chat-details?chatId=${chatId}`);
      const data = await res.json();
      console.log("Chat details:", data);
  
      // if data is not an array, wrap or transform it
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data && data.messages) {
        setMessages(data.messages); // if backend sends { messages: [...] }
      } else {
        setMessages([]); // fallback
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  

  return (
    <div className="chatbot-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h2>My Conversations</h2>
        <ul className="chat-history">
          {
            chatHistory.map(chat=>(
              <button key={chat} onClick={async () => await openChatDetails(chat)} value={chat}>
                {chat}
              </button>
            )
                
          )}
          
          <li onClick={handleNewChat} className="new-chat-button">+ New Chat</li>
        </ul>
      </div>

      {/* Main Chat Section */}
      <div className="chat-main">
        <div className="chat-header">
          <h2>Talking with Ava 🌱</h2>
          <p className="chat-subtitle">Your Mental Wellness Companion</p>
        </div>

        <div className="chat-messages">
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'bot' ? 'bot' : 'user'}`}
          >
            {msg.text}
          </div>
        ))}
        </div>

        <div className="chat-input-area">
          <input type="text" id="chat-input" placeholder="Type your thoughts..." onKeyDown={handleEnter} />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
