from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sugarpy.integrations.app import html_mlu_response, html_metrics_response
from sugarpy import get_metrics
from model import MetricsInput, MetricsOutput, MetricItem
from utils import convert_sugar_metrics_to_api_response
import uvicorn

app = FastAPI(
    contact={
        "name": "George D. Torres",
        "url": "http://web.ma.utexas.edu/users/gdavtor",
        "email": "gdavtor@gmail.com",
    },
    version="0.2",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO remove the frontend stuff
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
templates = Jinja2Templates(directory="static")


@app.get("/", response_class=HTMLResponse, deprecated=True)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/morph", deprecated=True)
async def morph(
    input_str: str = Form(...), age_y: str = Form(...), age_m: str = Form(...)
):
    resp = html_mlu_response(input_str)
    return HTMLResponse(content=resp, status_code=200)


@app.post("/metrics", deprecated=True)
async def metrics(
    input_str: str = Form(...), age_y: str = Form(...), age_m: str = Form(...)
):
    resp = html_metrics_response(input_str, int(age_y), int(age_m))
    return HTMLResponse(content=resp, status_code=200)


@app.post("/v2/metrics")
async def metrics(metrics_input: MetricsInput) -> MetricsOutput:
    metrics_result = get_metrics(metrics_input.sample, consolidate=False)
    return convert_sugar_metrics_to_api_response(metrics_result, metrics_input)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
