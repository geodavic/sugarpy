from sugarpy.metrics import SugarMetrics, ProcessedStrings
from sugarpy.norms import is_within_norms
from model import MetricsOutput, MetricItem, MetricsInput


def convert_sugar_metrics_to_api_response(
    sugar_metrics: SugarMetrics,
    metrics_input: MetricsInput,
    processed_strings: ProcessedStrings,
):
    output = MetricsOutput(
        mlu=MetricItem(
            score=sugar_metrics.mlu,
            processed_text="<br>".join(processed_strings.morphemes),
            img="https://picsum.photos/200",
            within_guidelines=is_within_norms(
                sugar_metrics.mlu, metrics_input.age_y, metrics_input.age_m, "mlu"
            ),
        ),
        wps=MetricItem(
            score=sugar_metrics.wps,
            processed_text="<br>".join(processed_strings.sentences),
            img="https://picsum.photos/200",
            within_guidelines=is_within_norms(
                sugar_metrics.wps, metrics_input.age_y, metrics_input.age_m, "wps"
            ),
        ),
        cps=MetricItem(
            score=sugar_metrics.cps,
            processed_text="<br>".join(processed_strings.clauses),
            img="https://picsum.photos/200",
            within_guidelines=is_within_norms(
                sugar_metrics.cps, metrics_input.age_y, metrics_input.age_m, "cps"
            ),
        ),
        tnw=MetricItem(
            score=sugar_metrics.tnw,
            processed_text=None,
            img="https://picsum.photos/200",
            within_guidelines=is_within_norms(
                sugar_metrics.tnw, metrics_input.age_y, metrics_input.age_m, "tnw"
            ),
        ),
    )

    return output
