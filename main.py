from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
import typing

app = FastAPI()

app.mount("/", StaticFiles(directory="static",html = True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
