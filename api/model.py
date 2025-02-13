from pydantic import BaseModel
from typing import Optional


class MetricItem(BaseModel):
    score: Optional[float]
    img: str
    processed_text: Optional[str] = None
    within_guidelines: Optional[bool] = None
    numerator: Optional[int] = None
    denominator: Optional[int] = None


class MetricsInput(BaseModel):
    sample: str
    age_y: int
    age_m: int


class MetricsOutput(BaseModel):
    mlu: MetricItem
    wps: MetricItem
    cps: MetricItem
    tnw: MetricItem
