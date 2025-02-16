import numpy as np
import plotly.graph_objects as go
import base64
import os

from sugarpy import is_within_norms, get_norms

from model import AssetRequest, AssetType
from draw import get_bellcurves, metric_to_formatted_score


def get_asset_from_request(request: AssetRequest):
    scores = {k: v for k, v in request.scores.items() if v is not None and v < np.inf}
    if request.type == AssetType.BELL_CURVE:
        return get_bellcurves(
            scores,
            request.age.years,
            request.age.months,
            file_format=request.response_format,
        )
    elif request.type == AssetType.METRIC_TABLE:
        return get_metric_table(
            scores,
            request.age.years,
            request.age.months,
            file_format=request.response_format,
        )
    else:
        raise ValueError("Unrecognized asset type")


def get_metric_table(scores, age_y, age_m, file_format="png"):
    """
    Get the scores shown in a results table.
    """
    headers = [
        "Metric",
        "Score",
        "Mean",
        "Within guidelines (1\u03c3)",
        "Within guidelines (2\u03c3)",
    ]
    values = []
    for metric in scores:
        score = scores[metric]
        score_str = metric_to_formatted_score(metric, score)
        one_sdnorm = (
            "Yes" if is_within_norms(score, age_y, age_m, metric, num_sd=1) else "No"
        )
        two_sdnorm = (
            "Yes" if is_within_norms(score, age_y, age_m, metric, num_sd=2) else "No"
        )
        mean = get_norms(age_y, age_m, metric)["mean_score"]
        values.append([metric.upper(), score_str, mean, one_sdnorm, two_sdnorm])

    values = list(map(list, zip(*values)))  # transpose
    fig = go.Figure(
        data=[
            go.Table(
                columnwidth=[10, 10, 10, 25, 25],
                header=dict(values=headers, align="center"),
                cells=dict(
                    values=values,
                    fill_color=[["white", "lightgrey"] * len(values)],
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
