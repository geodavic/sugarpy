from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    contact={
        "name": "George D. Torres",
    },
    version="0.1"
)

app.mount("/static", StaticFiles(directory="static",html = True), name="static")
templates = Jinja2Templates(directory="static")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request":request})

@app.post("/morph")
async def pong(
    input_str: str = Form(...)
):
    return HTMLResponse(content=f"<p> {input_str}</p>", status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
