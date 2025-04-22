  import React, { useState } from "react";
  import axios from "axios";
  import FileUpload from "./components/FileUpload";
  import GraphSelector from "./components/GraphSelector";
  import XColumnSelector from "./components/XColumnSelector";
  import YColumnSelector from "./components/YColumnSelector";
  import PlotDisplay from "./components/PlotDisplay";
  import StatsDisplay from "./components/StatsDisplay";

  // Create axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 30000, // Increase timeout to 30 seconds
    headers: {
      'Accept': 'application/json',
    }
  });

  function App() {
    const [file, setFile] = useState(null);
    const [columns, setColumns] = useState([]);
    const [xCol, setXCol] = useState("");
    const [yCols, setYCols] = useState([]);
    const [graphType, setGraphType] = useState("");
    const [plot, setPlot] = useState(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = async (file) => {
      try {
        setFile(file);
        setError(null);
        setIsLoading(true);
        
        // Create a new FormData instance for each upload
        const formData = new FormData();
        formData.append("file", file);
        
        console.log("Starting file upload...");
        
        const response = await api.post("/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        });
        
        console.log("Upload completed successfully:", response.data);
        
        if (response.data && response.data.columns) {
          setColumns(response.data.columns);
          // Reset column selections when new file is uploaded
          setXCol("");
          setYCols([]);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(`Failed to process file: ${err.message || "Unknown error"}`);
        setColumns([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleAnalyze = async () => {
      try {
        if (!file || !graphType) {
          alert("Please select a file and graph type");
          return;
        }

        if (!xCol && yCols.length === 0) {
          alert("Please select at least one column");
          return;
        }

        setIsLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("graph_type", graphType);
        
        const columnsToAnalyze = [];
        if (xCol) columnsToAnalyze.push(xCol);
        if (yCols.length > 0) columnsToAnalyze.push(...yCols);
        
        formData.append("columns", JSON.stringify(columnsToAnalyze));
        
        console.log("Sending analyze request with columns:", columnsToAnalyze);
        
        const response = await api.post("/analyze", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        
        console.log("Analysis completed successfully");
        
        if (response.data) {
          setPlot(response.data.plot);
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error("Analysis error:", err);
        setError(`Failed to analyze data: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    const downloadPlot = (base64Data) => {
      if (!base64Data) return;
      
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${base64Data}`;
      link.download = "data_visualization.png";
      link.click();
    };

    return (
      <div className="p-6 font-sans max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">📊 Data Visualization Tool</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

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
            disabled={isLoading || !file}
            className={`px-6 py-2 rounded transition mb-6 ${
              isLoading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-800 hover:bg-blue-900 text-white cursor-pointer'
            }`}
          >
            {isLoading ? "Processing..." : "Generate Plot"}
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
