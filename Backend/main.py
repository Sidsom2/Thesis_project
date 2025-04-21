from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import json
from utils import generate_plot, compute_stats # type: ignore

app = FastAPI()

# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specify your frontend URL exactly
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Be explicit about allowed methods
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],  # Specify allowed headers
    expose_headers=["Content-Disposition"],  # Headers the browser can expose
    max_age=600,  # Cache preflight requests for 10 minutes
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    return JSONResponse({
        "columns": df.columns.tolist(),
        "preview": df.head().to_dict(orient="records")
    })

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), graph_type: str = Form(...), columns: str = Form(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    col_list = json.loads(columns)
    image_bytes = generate_plot(df, graph_type, col_list)
    stats = compute_stats(df[col_list])
    return JSONResponse({
        "plot": image_bytes,
        "stats": stats
    })

# Add a simple endpoint to test CORS
@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is working"}