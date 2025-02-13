from sugarpy.metrics import SugarMetrics, consolidate_metrics
from sugarpy.norms import is_within_norms
from sugarpy.metrics import consolidate_metrics
from model import MetricsOutput, MetricItem, MetricsInput
from draw import draw_bellcurve
import numpy as np
from tabulate import tabulate
from typing import List


def convert_float_to_json(val):
    if np.abs(val) == np.inf:
        return None
    return val


def get_processed_string(itemized_sugar_metrics: List[SugarMetrics], metric: str):
    spacer = "&nbsp;&nbsp;"
    if metric == "mlu":
        rows = [
            [f"({m.morphemes})",spacer, m.morpheme_split_sample]
            for m in itemized_sugar_metrics
        ]
    if metric == "wps":
        counter = lambda m: "(n/a)" if m.sentences == 0 else f"({m.words_in_sentences})"
        rows = [[counter(m),spacer, m.sample] for m in itemized_sugar_metrics]
    if metric == "cps":
        clause_str = lambda m: f"({m.clauses})" if m.clauses > 1 else f"({m.clauses})"
        counter = lambda m: "(n/a)" if m.sentences == 0 else clause_str(m)
        rows = [[counter(m),spacer, m.sample] for m in itemized_sugar_metrics]

    tabulate_kwargs = {"tablefmt": "unsafehtml", "colalign": ("right",)}
    return tabulate(rows, **tabulate_kwargs)


def convert_sugar_metrics_to_api_response(
    itemized_sugar_metrics: List[SugarMetrics],
    metrics_input: MetricsInput,
):
    sugar_metrics = consolidate_metrics(itemized_sugar_metrics)
    output = MetricsOutput(
        mlu=MetricItem(
            score=convert_float_to_json(sugar_metrics.mlu),
            processed_text=get_processed_string(itemized_sugar_metrics, "mlu"),
            img=draw_bellcurve(sugar_metrics.mlu, metrics_input.age_y, metrics_input.age_m, "mlu"),
            within_guidelines=is_within_norms(
                sugar_metrics.mlu, metrics_input.age_y, metrics_input.age_m, "mlu"
            ),
            numerator=sugar_metrics.morphemes,
            denominator=sugar_metrics.utterances,
        ),
        wps=MetricItem(
            score=convert_float_to_json(sugar_metrics.wps),
            processed_text=get_processed_string(itemized_sugar_metrics, "wps"),
            img=draw_bellcurve(sugar_metrics.wps, metrics_input.age_y, metrics_input.age_m, "wps"),
            within_guidelines=is_within_norms(
                sugar_metrics.wps, metrics_input.age_y, metrics_input.age_m, "wps"
            ),
            numerator=sugar_metrics.words_in_sentences,
            denominator=sugar_metrics.sentences,
        ),
        cps=MetricItem(
            score=convert_float_to_json(sugar_metrics.cps),
            processed_text=get_processed_string(itemized_sugar_metrics, "cps"),
            img=draw_bellcurve(sugar_metrics.cps, metrics_input.age_y, metrics_input.age_m, "cps"),
            within_guidelines=is_within_norms(
                sugar_metrics.cps, metrics_input.age_y, metrics_input.age_m, "cps"
            ),
            numerator=sugar_metrics.clauses,
            denominator=sugar_metrics.sentences,
        ),
        tnw=MetricItem(
            score=sugar_metrics.tnw,
            processed_text=None,
            img=draw_bellcurve(sugar_metrics.tnw, metrics_input.age_y, metrics_input.age_m, "tnw"),
            within_guidelines=is_within_norms(
                sugar_metrics.tnw, metrics_input.age_y, metrics_input.age_m, "tnw"
            ),
        ),
    )

    return output
