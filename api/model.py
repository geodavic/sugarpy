from pydantic import BaseModel, model_validator
from typing import Optional, List
from sugarpy.norms import MIN_AGE, MAX_AGE
from sugarpy import MetricName

class Age(BaseModel):
    years: int
    months: int

    @model_validator(mode="after")
    def within_allowed_age_ranges(self):
        age = 12 * self.years + self.months
        if age < MIN_AGE or age > MAX_AGE:
            raise ValueError(
                f"Cannot accept ages outside of the allowed range ({MIN_AGE} to {MAX_AGE} months)"
            )
        return self
    
    @classmethod
    def from_int(cls, i: int):
        y = i//12
        m = i - (y*12)
        return cls(years=y,months=m)

class NormInput(BaseModel):
    age: Age
    metric: MetricName

class NormOutput(BaseModel):
    min_age: Age
    max_age: Age
    mean_score: float
    standard_deviation: float

class AppMetricItem(BaseModel):
    score: Optional[float]
    img: str
    processed_text: Optional[str] = None
    numerator: Optional[int] = None
    denominator: Optional[int] = None

class AppMetricsInput(BaseModel):
    sample: str
    age: Age

class AppMetricsOutput(BaseModel):
    number_of_utterances: int
    mlu: AppMetricItem
    wps: AppMetricItem
    cps: AppMetricItem
    tnw: AppMetricItem

class MetricsInput(BaseModel):
    samples: List[str]

class MetricsOutput(BaseModel):
    utterances: int
    morphemes: int
    words_in_sentences: int
    sentences: int
    clauses: int
    mlu: float
    wps: float
    cps: float
    tnw: int
