from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from sugarpy.integrations.app import html_mlu_response, html_metrics_response
from sugarpy import get_metrics, MetricName
from sugarpy.norms import get_norms

from model import AppMetricsInput, AppMetricsOutput, AppMetricItem, Age, NormInput, NormOutput, MetricsInput, MetricsOutput
from utils import convert_sugar_metrics_to_app_response, convert_sugar_metrics_to_api_response
import uvicorn
import sugarpy

tags_metadata = [
    {"name": "v1","description": "Legacy endpoints from the v1 application"},
    {
        "name": "v2", 
        "description": "v2 endpoints",
        "externalDocs": {
            "description": "Source code",
            "url": "https://github.com/geodavic/sugarpy",
        }
    }
]

app = FastAPI(
    title="sugarpy API",
    description="An API interface for the sugarpy python library",
    contact={
        "name": "George D. Torres",
        "url": "http://web.ma.utexas.edu/users/gdavtor",
    },
    version=sugarpy.__version__,
    openapi_tags=tags_metadata
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


@app.get("/", response_class=HTMLResponse, deprecated=True, tags=["v1"])
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/morph", deprecated=True, tags=["v1"])
async def morph(
    input_str: str = Form(...), age_y: str = Form(...), age_m: str = Form(...)
):
    resp = html_mlu_response(input_str)
    return HTMLResponse(content=resp, status_code=200)


@app.post("/metrics", deprecated=True, tags=["v1"])
async def metrics(
    input_str: str = Form(...), age_y: str = Form(...), age_m: str = Form(...)
):
    resp = html_metrics_response(input_str, int(age_y), int(age_m))
    return HTMLResponse(content=resp, status_code=200)


@app.post("/v2/web-metrics", tags=["v2"])
async def app_metrics(metrics_input: AppMetricsInput) -> AppMetricsOutput:
    """
    Metrics endpoint that the web app uses.
    """
    metrics_result = get_metrics(metrics_input.sample.split("\n"), consolidate=False)
    return convert_sugar_metrics_to_app_response(metrics_result, metrics_input.age)

@app.post("/v2/metrics", tags=["v2"])
async def metrics(metrics_input: MetricsInput) -> MetricsOutput:
    """
    Sugar Metrics endpoint
    """
    metrics_result = get_metrics(metrics_input.samples, consolidate=True)
    return convert_sugar_metrics_to_api_response(metrics_result)

@app.post("/v2/norms", tags=["v2"])
async def get_norms_by_age(norm_input: NormInput) -> NormOutput:
    norms = get_norms(norm_input.age.years, norm_input.age.months, norm_input.metric)
    return NormOutput(
        min_age=Age.from_int(norms["min_age"]),
        max_age=Age.from_int(norms["max_age"]),
        mean_score=norms["mean_score"],
        standard_deviation=norms["sd"]
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
