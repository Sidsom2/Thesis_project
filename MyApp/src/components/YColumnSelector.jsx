import React from "react";

const YColumnSelector = ({ columns, selected, onSelect }) => {
  const handleChange = (e) => {
    // Get all selected options when multiple is true
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    onSelect(selectedOptions);
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="font-medium mb-2">Y-Axis Column(s)</h3>
      <select
        multiple={true} // Enable multiple selection
        value={selected} // This is an array, but multiple={true} makes it valid
        onChange={handleChange}
        className="w-full p-2 border rounded"
        size={Math.min(5, columns.length)}
      >
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
      <p className="text-xs mt-1 text-gray-500">
        Hold Ctrl/Cmd to select multiple columns
      </p>
    </div>
  );
};

export default YColumnSelector;