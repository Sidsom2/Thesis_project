import React from "react";
import "./PlotDisplay.css";

const PlotDisplay = ({ plot }) => {
  if (!plot) return null;

  return (
    <div className="plot-container">
      <img
        src={`data:image/png;base64,${plot}`}
        alt="Generated Plot"
        className="plot-image"
      />
    </div>
  );
};

export default PlotDisplay;
