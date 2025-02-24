import numpy as np
import plotly.graph_objects as go
import base64
import os

from sugarpy import is_within_norms, get_norms

from model import AssetRequest, AssetType
from draw import get_bellcurves, metric_to_formatted_score

GREEN = "#20af2c"
YELLOW = "#FFDE21"
RED = "#ff2d5d"
WHITE = "white"
LIGHTGREY = "lightgrey"

def get_asset_from_request(request: AssetRequest):
    if request.type == AssetType.BELL_CURVE:
        return get_bellcurves(
            request.scores,
            request.age.years,
            request.age.months,
            file_format=request.response_format,
        )
    elif request.type == AssetType.METRIC_TABLE:
        return get_metric_table(
            request.scores,
            request.age.years,
            request.age.months,
            file_format=request.response_format,
        )
    else:
        raise ValueError("Unrecognized asset type")


def _results_str_and_color(score, age_y, age_m, metric):
    if score is None:
        return "N/A", WHITE
    norm1 = is_within_norms(score, age_y, age_m, metric, num_sd=1)
    norm2 = is_within_norms(score, age_y, age_m, metric, num_sd=2)
    if norm1:
        return "Within normal range", GREEN
    if norm2:
        return "Below average", YELLOW
    return "Delayed", RED


def get_metric_table(scores, age_y, age_m, file_format="png"):
    """
    Get the scores shown in a results table.
    """
    headers = [
        "Metric",
        "Score",
        "Mean",
        "Result",
    ]
    values = []
    result_colors = []
    for metric in scores:
        score = scores[metric]
        score_str = metric_to_formatted_score(metric, score)
        results_str, color = _results_str_and_color(score, age_y, age_m, metric)
        mean = get_norms(age_y, age_m, metric)["mean_score"]
        values.append([metric.upper(), score_str, mean, results_str])
        result_colors.append(color)

    values = list(map(list, zip(*values)))  # transpose
    fig = go.Figure(
        data=[
            go.Table(
                columnwidth=[10, 10, 10, 12],
                header=dict(values=headers, align="center"),
                cells=dict(
                    values=values,
                    fill=dict(color=[WHITE, WHITE, WHITE, result_colors]),
                    align="center",
                ),
            )
        ]
    )
    # Have to manually set the height of the table in pixels, or else
    # dead whitespace will appear below. Plotly can't determine height -_-
    # If tabling fewer than 4 metrics, there will be white space.
    fig.update_layout(
        margin=dict(l=0, r=0, t=0, b=0, pad=0, autoexpand=False), height=108
    )
    fig.write_image(f"table.{file_format}", scale=6)

    if file_format == "svg":
        asset_str = open(f"table.{file_format}", "r").read()
    else:
        asset_str = base64.b64encode(open(f"table.{file_format}", "rb").read()).decode(
            "utf-8"
        )
    os.remove(f"table.{file_format}")
    return asset_str
