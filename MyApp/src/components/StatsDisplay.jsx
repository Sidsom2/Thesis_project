import React from "react";
import "./StatsDisplay.css";

const StatsDisplay = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stats-container">
      <h2 className="stats-heading">📈 Statistics</h2>
      {Object.keys(stats).map((col) => (
        <div key={col} className="stats-section">
          <h3 className="stats-column-title">{col}</h3>
          <ul className="stats-list">
            {Object.entries(stats[col]).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {value}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
