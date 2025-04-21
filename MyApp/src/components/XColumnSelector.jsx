import React from "react";

const XColumnSelector = ({ columns, selected, onSelect }) => {
  const handleChange = (e) => {
    onSelect(e.target.value); // Pass single scalar value
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="font-medium mb-2">X-Axis Column</h3>
      <select
        value={selected || ""} // Ensure this is a scalar value
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select X Column</option>
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
    </div>
  );
};

export default XColumnSelector;