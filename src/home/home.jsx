import React, { useState, useEffect } from "react";
import "./home.css";
import { url_domain } from "../App";
import MoodGraph from "./graph";
import { Link } from 'react-router-dom';


function HomeDashboard() {
  const [step, setStep] = useState("mood"); 
  const [selectedMood, setSelectedMood] = useState(null);
  const [talk, setTalk] = useState("");
  const [moods, setMoods] = useState([]);

  // Send payload to backend
  const handleSubmit = async () => {
    const payload = {
      date: new Date().toISOString(),
      mood: selectedMood,
      talk: talk,
    };

    try {
      const res = await fetch(`${url_domain}/api/save-emotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStep("done");
      } else {
        console.error("Failed to save entry");
      }
    } catch (err) {
      console.error("Error submitting entry:", err);
    }
  };

  useEffect(() => {
    const getLastWeekEmotion = async () => {
      try {
        const res = await fetch(`${url_domain}/api/get-emotion`);
        if (!res.ok) throw new Error("Failed to fetch moods");
  
        const data = await res.json();
        console.log(data);
        setMoods(data);
      } catch (err) {
        console.error("Error fetching moods:", err);
      }
    };
  
    getLastWeekEmotion();
  }, []);


  return (
    <div className="home-container">
      {/* Step 1: Mood Selector */}
      {step === "mood" && (
        <div className="mood-section">
          <h2>How are you feeling today?</h2>
          <div className="emoji-list">
            <span onClick={() => { setSelectedMood("HAPPY"); setStep("talk"); }}>😊</span>
            <span onClick={() => { setSelectedMood("LOW"); setStep("talk"); }}>😔</span>
            <span onClick={() => { setSelectedMood("ANGRY"); setStep("talk"); }}>😡</span>
            <span onClick={() => { setSelectedMood("SAD"); setStep("talk"); }}>😢</span>
            <span onClick={() => { setSelectedMood("HYPED"); setStep("talk"); }}>😃</span>
            <span onClick={() => { setSelectedMood("NOT SPECIFIC"); setStep("talk"); }}>😑</span>
          </div>
        </div>
      )}

      {/* Step 2: Small Talk */}
      {step === "talk" && (
        <div className="talk-section">
          <h2>Want to talk a little about your day?</h2>
          <textarea
            value={talk}
            onChange={(e) => setTalk(e.target.value)}
            placeholder="Write a few words..."
          ></textarea>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {/* Step 3: Done Message */}
      {step === "done" && (
        <div className="thankyou-section">
          <h2>💚 Thank you for sharing!</h2>
          <p>Your entry has been saved. Wishing you a peaceful day.</p>
        </div>
      )}

      {/* Encouraging Story Section */}
      <div className="story-section">
        <h3>🌟 Daily Encouragement</h3>
        <p>
          "Even the smallest step forward is progress.  
          Remember, healing is not a race — it’s a journey.  
          You are stronger than you think!"
        </p>
        <Link to="/mood-history">Want to see previous emotions?</Link>
      </div>

      {/* Last Week Performance*/}
      <div className="emotion-feeling">
        <h3>Emotion Chart</h3>
        <MoodGraph moods={moods} />
      </div>
    </div>
  );
}

export default HomeDashboard;
