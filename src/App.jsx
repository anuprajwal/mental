import { useState } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import ChatBot from './chatbot/chat-bot.JSX';
import HomeDashboard from "./home/home.jsx"
import JournalHistory from "./moodHistory/history.jsx"
import Schedule from "./schedule/schedule.jsx"


export const url_domain = "http://127.0.0.1:5000"


function App() {

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        {/* <Link to="/about">About</Link> |{" "}
         */}
        <Link to="/chat-bot">Chatbot</Link> |{" "}
        <Link to="/mood-history">Mood History</Link> |{" "}
        <Link to="/schedule">Schedule</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        {/*<Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
        <Route path="/chat-bot" element={<ChatBot />} />
        <Route path="/mood-history" element={<JournalHistory />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </div>
  )
}

export default App
