import React from "react";

const GraphSelector = ({ onSelect }) => {
  const graphTypes = [
    { value: "hist", label: "Histogram" },
    { value: "scatter", label: "Scatter Plot" },
    { value: "box", label: "Box Plot" },
    { value: "heatmap", label: "Heatmap (Correlation)" },
  ];

  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="font-medium mb-2">Graph Type</h3>
      <select 
        onChange={handleChange} 
        className="w-full p-2 border rounded"
        defaultValue=""
      >
        <option value="" disabled>Select Graph Type</option>
        {graphTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GraphSelector;