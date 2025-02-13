from sugarpy.metrics import SugarMetrics, ProcessedStrings
from sugarpy.norms import is_within_norms
from model import MetricsOutput, MetricItem, MetricsInput
import numpy as np

def convert_float_to_json(val):
    if np.abs(val) == np.inf:
        return None
    return val

def convert_sugar_metrics_to_api_response(
    sugar_metrics: SugarMetrics,
    metrics_input: MetricsInput,
    processed_strings: ProcessedStrings,
):
    output = MetricsOutput(
        mlu=MetricItem(
            score=convert_float_to_json(sugar_metrics.mlu),
            processed_text="<br>".join(processed_strings.morphemes),
            img="https://picsum.photos/500/200",
            within_guidelines=is_within_norms(
                sugar_metrics.mlu, metrics_input.age_y, metrics_input.age_m, "mlu"
            ),
            numerator=sugar_metrics.morphemes,
            denominator=sugar_metrics.utterances
        ),
        wps=MetricItem(
            score=convert_float_to_json(sugar_metrics.wps),
            processed_text="<br>".join(processed_strings.sentences),
            img="https://picsum.photos/500/200",
            within_guidelines=is_within_norms(
                sugar_metrics.wps, metrics_input.age_y, metrics_input.age_m, "wps"
            ),
            numerator=sugar_metrics.words_in_sentences,
            denominator=sugar_metrics.sentences
        ),
        cps=MetricItem(
            score=convert_float_to_json(sugar_metrics.cps),
            processed_text="<br>".join(processed_strings.clauses),
            img="https://picsum.photos/500/200",
            within_guidelines=is_within_norms(
                sugar_metrics.cps, metrics_input.age_y, metrics_input.age_m, "cps"
            ),
            numerator=sugar_metrics.clauses,
            denominator=sugar_metrics.sentences
        ),
        tnw=MetricItem(
            score=sugar_metrics.tnw,
            processed_text=None,
            img="https://picsum.photos/500/200",
            within_guidelines=is_within_norms(
                sugar_metrics.tnw, metrics_input.age_y, metrics_input.age_m, "tnw"
            ),
        ),
    )

    return output
