from sugarpy import get_metrics, get_norms
import matplotlib.pyplot as plt
import math
import numpy as np
import tempfile
import os

def html_mlu_response(input_str: str):
    scores,morph_lines = get_metrics(input_str)
    mlu_score = round(scores.mlu,2)
    # todo: make this a template
    resp = f"""<center><b><p style="font-size:20px">Total utterances: {scores.utterances}, morphemes: {scores.morphemes}, MLU: {mlu_score}</p></b></center><br>"""
    resp += "<p>" + "<br>".join(morph_lines) + "</p>"
        
    return resp

def draw_bellcurves(scores, age_y, age_m):
    plt.clf()    

    figure, axis = plt.subplots(4,1,figsize=(5,8))

    mean, sd = get_norms(age_y, age_m, "tnw")
    x = np.linspace(mean-4*sd, mean+4*sd, 200)
    y = 1/(sd*math.sqrt(2*math.pi)) * np.exp(-0.5*((x-mean)/sd)**2)
    score = scores.tnw
    title = f"TNW: {scores.tnw}"
    axis[0].fill_between(x,y, color='b', alpha=0.2)
    axis[0].tick_params(left=False, labelleft=False)
    axis[0].set_xticks([mean-sd,mean,mean+sd])
    axis[0].axvline(x=score,color='r',label=str(score))
    axis[0].title.set_text(title)
    [s.set_visible(False) for s in axis[0].spines.values()]

    mean, sd = get_norms(age_y, age_m, "mlu")
    x = np.linspace(mean-4*sd, mean+4*sd, 200)
    y = 1/(sd*math.sqrt(2*math.pi)) * np.exp(-0.5*((x-mean)/sd)**2)
    score = round(scores.mlu,2)
    title = f"MLU: {score}"
    axis[1].fill_between(x,y, color='b', alpha=0.2)
    axis[1].tick_params(left=False, labelleft=False)
    axis[1].set_xticks([mean-sd,mean,mean+sd])
    axis[1].axvline(x=score,color='r',label=str(score))
    axis[1].title.set_text(title)
    [s.set_visible(False) for s in axis[1].spines.values()]

    mean, sd = get_norms(age_y, age_m, "wps")
    x = np.linspace(mean-4*sd, mean+4*sd, 200)
    y = 1/(sd*math.sqrt(2*math.pi)) * np.exp(-0.5*((x-mean)/sd)**2)
    score = round(scores.wps,2)
    title = f"WPS: {score}"
    axis[2].fill_between(x,y, color='b', alpha=0.2)
    axis[2].tick_params(left=False, labelleft=False)
    axis[2].set_xticks([mean-sd,mean,mean+sd])
    axis[2].axvline(x=score,color='r',label=str(score))
    axis[2].title.set_text(title)
    [s.set_visible(False) for s in axis[2].spines.values()]

    mean, sd = get_norms(age_y, age_m, "cps")
    x = np.linspace(mean-4*sd, mean+4*sd, 200)
    y = 1/(sd*math.sqrt(2*math.pi)) * np.exp(-0.5*((x-mean)/sd)**2)
    score = round(scores.cps,2)
    title = f"CPS: {score}"
    axis[3].fill_between(x,y, color='b', alpha=0.2)
    axis[3].tick_params(left=False, labelleft=False)
    axis[3].set_xticks([mean-sd,mean,mean+sd])
    axis[3].axvline(x=score,color='r',label=str(score))
    axis[3].title.set_text(title)
    [s.set_visible(False) for s in axis[3].spines.values()]

    figure.subplots_adjust(hspace=1)
    plt.savefig("curves.svg")
    svg_str = open("curves.svg","r").read()
    os.remove("curves.svg")

    return svg_str


def html_metrics_response(input_str: str, age_y: int, age_m: int):
    scores,_ = get_metrics(input_str)
    curves_svg = draw_bellcurves(scores, age_y, age_m)
    
    rval = '<div style="text-align: center"> '
    rval += curves_svg
    rval += '</div>'

    return rval
