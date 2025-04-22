import React, { useState } from "react";

const FileUpload = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Update UI state
    setIsUploading(true);
    setSelectedFileName(file.name);
    
    try {
      // Call the parent's onUpload function
      await onUpload(file);
      console.log("File successfully processed");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="font-medium mb-2">Upload CSV File</h3>
      
      <label className={`inline-block px-4 py-2 rounded cursor-pointer ${isUploading ? 'bg-gray-500' : 'bg-blue-800'} text-white`}>
        {isUploading ? "Uploading..." : "Choose File"}
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleChange} 
          className="hidden"
          disabled={isUploading}
        />
      </label>
      
      {selectedFileName && (
        <div className="mt-2 text-sm">
          {isUploading ? (
            <div className="flex items-center">
              <div className="mr-2 w-4 h-4 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-gray-200 rounded-full animate-spin"></div>
              Processing: {selectedFileName}
            </div>
          ) : (
            <div>Selected: {selectedFileName}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
