import React from "react";
import "./Dropdown.css";

const Dropdown = ({ label, id, options, value, onChange, placeholder }) => {
  return (
    <div className="dropdown-container">
      <label htmlFor={id} className="dropdown-label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dropdown-select"
      >
        <option value="">{placeholder || "--Select--"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
