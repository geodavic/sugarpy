from sugarpy.metrics import SugarMetrics, consolidate_metrics
from sugarpy.metrics import consolidate_metrics
from model import AppMetricsOutput, AppMetricItem, Age, MetricsOutput
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


def convert_sugar_metrics_to_app_response(
    itemized_sugar_metrics: List[SugarMetrics],
    age: Age
):
    sugar_metrics = consolidate_metrics(itemized_sugar_metrics)
    output = AppMetricsOutput(
        number_of_utterances=sugar_metrics.utterances,
        mlu=AppMetricItem(
            score=convert_float_to_json(sugar_metrics.mlu),
            processed_text=get_processed_string(itemized_sugar_metrics, "mlu"),
            img=draw_bellcurve(sugar_metrics.mlu, age.years, age.months, "mlu"),
            numerator=sugar_metrics.morphemes,
            denominator=sugar_metrics.utterances,
        ),
        wps=AppMetricItem(
            score=convert_float_to_json(sugar_metrics.wps),
            processed_text=get_processed_string(itemized_sugar_metrics, "wps"),
            img=draw_bellcurve(sugar_metrics.wps, age.years, age.months, "wps"),
            numerator=sugar_metrics.words_in_sentences,
            denominator=sugar_metrics.sentences,
        ),
        cps=AppMetricItem(
            score=convert_float_to_json(sugar_metrics.cps),
            processed_text=get_processed_string(itemized_sugar_metrics, "cps"),
            img=draw_bellcurve(sugar_metrics.cps, age.years, age.months, "cps"),
            numerator=sugar_metrics.clauses,
            denominator=sugar_metrics.sentences,
        ),
        tnw=AppMetricItem(
            score=sugar_metrics.tnw,
            processed_text=None,
            img=draw_bellcurve(sugar_metrics.tnw, age.years, age.months, "tnw"),
        ),
    )

    return output

def convert_sugar_metrics_to_api_response(
    sugar_metrics: SugarMetrics
):
    return MetricsOutput(
        utterances=sugar_metrics.utterances,
        morphemes=sugar_metrics.morphemes,
        words_in_sentences=sugar_metrics.words_in_sentences,
        sentences=sugar_metrics.sentences,
        clauses=sugar_metrics.clauses,
        mlu=sugar_metrics.mlu,
        wps=sugar_metrics.wps,
        cps=sugar_metrics.cps,
        tnw=sugar_metrics.tnw,
    )
