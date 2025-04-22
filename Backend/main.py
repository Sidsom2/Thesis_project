from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import json
from utils import generate_plot, compute_stats # type: ignore

app = FastAPI()

# Configure CORS with more permissive settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file content in chunks to handle large files
        contents = await file.read()
        
        # Verify file has content
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")
            
        # Try to parse as CSV
        try:
            df = pd.read_csv(io.BytesIO(contents))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")
        
        # Return JSON response with columns and preview
        return JSONResponse({
            "columns": df.columns.tolist(),
            "preview": df.head().to_dict(orient="records")
        })
    except Exception as e:
        print(f"Error in upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), graph_type: str = Form(...), columns: str = Form(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        col_list = json.loads(columns)
        
        if not col_list:
            raise HTTPException(status_code=400, detail="No columns selected")
            
        image_bytes = generate_plot(df, graph_type, col_list)
        stats = compute_stats(df[col_list])
        
        return JSONResponse({
            "plot": image_bytes,
            "stats": stats
        })
    except Exception as e:
        print(f"Error in analyze: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Simple test endpoint
@app.get("/")
async def root():
    return {"message": "API is running"}

# Test CORS endpoint
@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is working"}
