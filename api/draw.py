import matplotlib.pyplot as plt
import tempfile
import os
import math
import numpy as np
from sugarpy.norms import get_norms
import base64
from io import BytesIO


def metric_to_formatted_score(metric, score):
    if metric == "mlu":
        return f"{score:.2f}"
    if metric == "cps":
        return f"{score:.2f}"
    if metric == "tnw":
        return f"{int(score)}"
    if metric == "wps":
        return f"{score:.2f}"


def _create_labels(ticks):
    strs = ["\u03bc-2\u03c3", "\u03bc-\u03c3", "\u03bc"]
    return [str(round(t, 2)) + f"\n({g})" for t, g in zip(ticks, strs)]


def _draw_bellcurve(figure, axis, score, age_y, age_m, metric):
    norms = get_norms(age_y, age_m, metric)
    mean, sd = norms["mean_score"], norms["sd"]

    x = np.linspace(mean - 4 * sd, mean + 4 * sd, 200)
    y = 1 / (sd * math.sqrt(2 * math.pi)) * np.exp(-0.5 * ((x - mean) / sd) ** 2)
    title = f"{metric.upper()} score: {metric_to_formatted_score(metric, score)}"

    axis.fill_between(x, y, color="b", alpha=0.2)
    axis.tick_params(left=False, labelleft=False)
    ticks = [mean - 2 * sd, mean - sd, mean]
    axis.set_xticks(ticks, labels=_create_labels(ticks))
    axis.axvline(x=score, color="r")
    axis.title.set_text(title)
    [s.set_visible(False) for s in axis.spines.values()]


def _get_subplots_args(scores, width=2):
    height = math.ceil(len(scores) / 2)
    figsize = (6 * width, 2.5 * height)
    return height, width, figsize


def draw_bellcurves(scores, age_y, age_m):
    plt.clf()

    if len(scores) == 1:
        plt.figure(figsize=(8, 2.5))
        figure, axis = plt.gcf(), plt.gca()
        metric = list(scores.keys())[0]
        _draw_bellcurve(figure, axis, scores[metric], age_y, age_m, metric)
        return

    height, width, figsize = _get_subplots_args(scores)
    figure, axis = plt.subplots(height, width, figsize=figsize, layout="constrained")
    if height == 1:
        axis = [axis]
    for i in range(height):
        for j in range(width):
            if i * width + j >= len(scores):
                figure.delaxes(axis[i][j])
            else:
                metric = list(scores.keys())[i * width + j]
                _draw_bellcurve(
                    figure, axis[i][j], scores[metric], age_y, age_m, metric
                )

    figure.subplots_adjust(hspace=1)


def get_bellcurves(scores, age_y, age_m, file_format="png"):
    draw_bellcurves(scores, age_y, age_m)
    plt.savefig(f"curves.{file_format}", bbox_inches="tight", dpi=900)
    if file_format == "svg":
        asset_str = open("curves.svg", "r").read()
    if file_format == "png":
        asset_str = base64.b64encode(open("curves.png", "rb").read()).decode("utf-8")
    os.remove(f"curves.{file_format}")
    return asset_str
