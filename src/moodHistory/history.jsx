import React, { useState, useEffect } from "react";
import "./history.css";
import { url_domain } from "../App";

function JournalHistory() {
  const [journals, setJournals] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const filters = ["all", "happy", "low", "angry", "sad", "hyped", "not specific"];

  // Fetch journals whenever filters change
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const params = new URLSearchParams();
        selectedFilters.forEach(f => params.append("filters", f));

        console.log(params.toString());

        const res = await fetch(`${url_domain}/api/get-journal?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch journals");

        const data = await res.json();
        console.log(data);
        setJournals(data);
      } catch (err) {
        console.error("Error fetching journals:", err);
      }
    };

    fetchJournals();
  }, [selectedFilters]);

  const toggleFilter = (filter) => {
    if (filter === "all") {
      setSelectedFilters(["all"]);
    } else {
      setSelectedFilters(prev => {
        const withoutAll = prev.filter(f => f !== "all");
        console.log(withoutAll.includes(filter) ? withoutAll.filter(f => f !== filter) : [...withoutAll, filter])
        return withoutAll.includes(filter)
          ? withoutAll.filter(f => f !== filter)
          : [...withoutAll, filter];
      });
    }
  };

  const matchEmoji = (mood)=>{
    switch(mood.toLowerCase()){
      case "happy":
        return "😊";
      case "low":
        return "😞";
      case "angry":
        return "😡";
    
    case "sad":
      return "😢";
    case "hyped":
      return "⚡";
    case "not specific":
      return "😐";
    }
  }

  return (
    <div className="journal-history">
      <h1>Journal History</h1>

      {/* Filters */}
      <div className="filters">
        {filters.map((filter) => (
          <label key={filter}>
            <input
              type="checkbox"
              checked={selectedFilters.includes(filter)}
              onChange={() => toggleFilter(filter)}
            />
            {filter}
          </label>
        ))}
      </div>

      {/* Cards */}
      <div className="journal-list">
        {journals.map((entry) => (
          <div
            key={entry.time}
            className="journal-card"
            onClick={() => setSelectedJournal(entry)}
          >
            <div className="journal-header">
              <span className="mood">{matchEmoji(entry.mood)}</span>
              <span className="date">{entry.date} - {entry.time}</span>
            </div>
            <p className="snippet">{entry.talk}</p>
            <div className="tags">
              {entry.tags && entry.tags.map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {selectedJournal && (
        <div className="popup-overlay" onClick={() => setSelectedJournal(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJournal.moodEmoji} {selectedJournal.date} - {selectedJournal.time}</h2>
            <p>{selectedJournal.response}</p>
            <div className="tags">
              {selectedJournal.tags && selectedJournal.tags.map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
            <button onClick={() => setSelectedJournal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JournalHistory;
