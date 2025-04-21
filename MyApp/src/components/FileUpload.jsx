import React from "react";
import "./FileUpload.css";

const FileUpload = ({ onUpload }) => {
  const handleChange = (e) => {
    onUpload(e.target.files[0]);
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        Choose File
        <input type="file" accept=".csv" onChange={handleChange} className="file-input-hidden" />
      </label>
    </div>
  );
};

export default FileUpload;
