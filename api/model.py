from pydantic import BaseModel, model_validator
from typing import Optional, List
from sugarpy.norms import MIN_AGE, MAX_AGE


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

    @model_validator(mode="after")
    def within_allowed_age_ranges(self):
        age = 12 * self.age_y + self.age_m
        if age < MIN_AGE or age > MAX_AGE:
            raise ValueError(
                f"Cannot accept ages outside of the allowed range ({MIN_AGE} to {MAX_AGE} months)"
            )
        return self


# TODO: do we want this to return the itemized SugarMetrics too?
class MetricsOutput(BaseModel):
    mlu: MetricItem
    wps: MetricItem
    cps: MetricItem
    tnw: MetricItem
