import matplotlib.pyplot as plt
import tempfile
import os
import math
import numpy as np
from sugarpy.norms import get_norms

metric_to_title = {
    "mlu": "MLU score distribution",
    "cps": "CPS score distribution",
    "tnw": "TNW score distribution",
    "wps": "WPS score distribution"
}

def create_labels(ticks):
    strs = ["\u03bc-2\u03c3", "\u03bc-\u03c3", "\u03bc"]
    return [str(round(t, 2)) + f"\n({g})" for t, g in zip(ticks, strs)]

def draw_bellcurve(score, age_y, age_m, metric):
    if score == np.inf:
        return ""

    plt.clf()
    plt.figure(figsize=(10, 3))
    figure, axis = plt.gcf(), plt.gca()
    norms = get_norms(age_y, age_m, metric)
    mean, sd = norms["mean_score"], norms["sd"]

    x = np.linspace(mean-4*sd, mean+4*sd, 200)
    y = 1/(sd * math.sqrt(2 * math.pi)) * np.exp(-0.5 * ((x-mean)/sd) ** 2)
    title = metric_to_title[metric]

    axis.fill_between(x,y, color="b", alpha=0.2)
    axis.tick_params(left=False, labelleft=False)
    ticks = [mean - 2 *sd, mean - sd, mean]
    axis.set_xticks(ticks, labels=create_labels(ticks))
    axis.axvline(x=score, color='r')
    axis.title.set_text(title)
    [s.set_visible(False) for s in axis.spines.values()]

    plt.savefig("curves.svg", bbox_inches="tight")
    svg_str = open("curves.svg", "r").read()
    os.remove("curves.svg")

    return svg_str
