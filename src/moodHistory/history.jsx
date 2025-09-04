// // src/pages/JournalHistory.jsx
// import React, { useState, useEffect } from "react";
// import "./history.css";
// import { url_domain } from "../App";

// const moodEmojis = {
//   happy: "😊",
//   low: "😞",
//   angry: "😡",
//   sad: "😢",
//   hyped: "⚡",
//   "NOT SPECIFIC": "😐",
// };

// function JournalHistory() {
//   const [journals, setJournals] = useState([]);
//   const [selectedFilters, setSelectedFilters] = useState(["all"]);
//   const [selectedJournal, setSelectedJournal] = useState(null);

//   useEffect(() => {
//     fetch(`${url_domain}/api/get-journal`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setJournals(data)})
//       .catch((err) => console.error("Error fetching journals:", err));
//   }, [url_domain]);

//   const handleFilterChange = (value) => {
//     if (value === "all") {
//       setSelectedFilters(["all"]);
//     } else {
//       let updated = [...selectedFilters];
//       if (updated.includes("all")) updated = [];
//       if (updated.includes(value)) {
//         updated = updated.filter((f) => f !== value);
//       } else {
//         updated.push(value);
//       }
//       setSelectedFilters(updated.length ? updated : ["all"]);
//     }
//   };

//   const filteredJournals =
//     selectedFilters.includes("all")
//       ? journals
//       : journals.filter((j) => selectedFilters.includes(j.mood));

//   return (
//     <div className="journal-page">
//       <h1 className="journal-title">Journal History</h1>

//       {/* Filter Section */}
//       <div className="filters">
//         {["all", "happy", "low", "angry", "sad", "hyped", "NOT SPECIFIC"].map(
//           (mood) => (
//             <label key={mood} className="filter-option">
//               <input
//                 type="checkbox"
//                 checked={selectedFilters.includes(mood)}
//                 onChange={() => handleFilterChange(mood)}
//               />
//               {mood}
//             </label>
//           )
//         )}
//       </div>

//       {/* Journal Cards */}
//       <div className="journal-grid">
//         {filteredJournals.map((j, index) => (
//           <div
//             key={index}
//             onClick={() => setSelectedJournal(j)}
//             className="journal-card"
//           >
//             <div className="journal-card-header">
//               <span className="journal-emoji">{moodEmojis[j.mood]}</span>
//               <span className="journal-date">
//                 {j.date} - {j.time}
//               </span>
//             </div>
//             <p className="journal-snippet">{j.snippet}</p>
//             <div className="journal-tags">
//               {j.tags.map((tag, i) => (
//                 <span key={i} className="tag">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Popup Modal */}
//       {selectedJournal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button
//               className="modal-close"
//               onClick={() => setSelectedJournal(null)}
//             >
//               ✖
//             </button>
//             <div className="journal-card-header">
//               <span className="journal-emoji">
//                 {moodEmojis[selectedJournal.mood]}
//               </span>
//               <span className="journal-date">
//                 {selectedJournal.date} - {selectedJournal.time}
//               </span>
//             </div>
//             <p className="journal-snippet">{selectedJournal.snippet}</p>
//             <div className="journal-tags">
//               {selectedJournal.tags.map((tag, i) => (
//                 <span key={i} className="tag">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default JournalHistory;



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
