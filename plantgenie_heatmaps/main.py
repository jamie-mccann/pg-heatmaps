from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app_path = Path(__file__).parent
static_files_path = app_path / "pg-react-frontend" / "dist"

app = FastAPI()

app.mount(
    "/static", StaticFiles(directory=static_files_path), name="static"
)


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(static_files_path / "index.html")

@app.get("/api")
async def api_root():
    return {"message": "Hello from API!"}
