import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import GraphSelector from "./components/GraphSelector";
import XColumnSelector from "./components/XColumnSelector";
import YColumnSelector from "./components/YColumnSelector";
import PlotDisplay from "./components/PlotDisplay";
import StatsDisplay from "./components/StatsDisplay";

function App() {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xCol, setXCol] = useState(""); // Initialize as string for single selection
  const [yCols, setYCols] = useState([]); // Initialize as array for multiple selection
  const [graphType, setGraphType] = useState("");
  const [plot, setPlot] = useState(null);
  const [stats, setStats] = useState(null);

  const handleFileUpload = async (file) => {
    setFile(file);
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:8000/upload", formData);
    setColumns(res.data.columns);
  };

  const handleAnalyze = async () => {
    try {
      if (!file || !graphType) {
        alert("Please select a file and graph type");
        return;
      }
  
      // For scatter plots, we need both x and y columns
      if (graphType === "scatter" && (!xCol || yCols.length === 0)) {
        alert("Scatter plots require both X and Y columns");
        return;
      }
  
      // For other plot types, we need at least one column
      if (!xCol && yCols.length === 0) {
        alert("Please select at least one column");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("graph_type", graphType);
      
      // Create a list of columns to analyze
      const columnsToAnalyze = [];
      if (xCol) columnsToAnalyze.push(xCol);
      if (yCols.length > 0) columnsToAnalyze.push(...yCols);
      
      formData.append("columns", JSON.stringify(columnsToAnalyze));
      
      console.log("Sending request to analyze...");
      
      // Set up axios with the proper configuration for CORS
      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false, // Set this to true only if you need to send cookies
      });
      
      console.log("Response received:", response.data);
      
      setPlot(response.data.plot);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error analyzing data:", error);
      console.error("Error details:", error.response ? error.response.data : "No response data");
      alert("Error analyzing data. Check console for details.");
    }
  };

  const downloadPlot = (base64Data) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = "plot.png";
    link.click();
  };

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">📊 Data Visualization Tool</h1>

      <div className="flex flex-wrap gap-6 mb-8 justify-center items-start">
        <div className="flex flex-col gap-4">
          <FileUpload onUpload={handleFileUpload} />
          <GraphSelector onSelect={setGraphType} />
        </div>
        <div className="flex flex-col gap-4">
          <XColumnSelector columns={columns} selected={xCol} onSelect={setXCol} />
          <YColumnSelector columns={columns} selected={yCols} onSelect={setYCols} />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={handleAnalyze}
          className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition mb-6"
        >
          Generate Plot
        </button>

        <PlotDisplay plot={plot} />

        {plot && (
          <button
            onClick={() => downloadPlot(plot)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition mt-4"
          >
            📥 Export Plot
          </button>
        )}
      </div>

      <StatsDisplay stats={stats} />
    </div>
  );
}

export default App;