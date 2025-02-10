import numpy as np

SD_WITHIN_NORM = 2


norms = {
    "tnw": [
        {"min_age": 36, "max_age": 41, "mean_score": 192.3, "sd": 61.22},
        {"min_age": 42, "max_age": 47, "mean_score": 244.05, "sd": 58.07},
        {"min_age": 48, "max_age": 53, "mean_score": 261.4, "sd": 69.98},
        {"min_age": 54, "max_age": 59, "mean_score": 278.71, "sd": 60.14},
        {"min_age": 60, "max_age": 71, "mean_score": 299.81, "sd": 61.46},
        {"min_age": 72, "max_age": 83, "mean_score": 337.73, "sd": 72.5},
        {"min_age": 84, "max_age": 107, "mean_score": 379.63, "sd": 59.28},
        {"min_age": 108, "max_age": 131, "mean_score": 421.36, "sd": 66.61},
    ],
    "mlu": [
        {"min_age": 36, "max_age": 41, "mean_score": 4.24, "sd": 1.37},
        {"min_age": 42, "max_age": 47, "mean_score": 5.41, "sd": 1.28},
        {"min_age": 48, "max_age": 53, "mean_score": 5.79, "sd": 1.53},
        {"min_age": 54, "max_age": 59, "mean_score": 6.18, "sd": 1.32},
        {"min_age": 60, "max_age": 71, "mean_score": 6.66, "sd": 1.35},
        {"min_age": 72, "max_age": 83, "mean_score": 7.6, "sd": 1.6},
        {"min_age": 84, "max_age": 107, "mean_score": 8.59, "sd": 1.4},
        {"min_age": 108, "max_age": 131, "mean_score": 9.61, "sd": 1.52},
    ],
    "wps": [
        {"min_age": 36, "max_age": 41, "mean_score": 5.27, "sd": 1.39},
        {"min_age": 42, "max_age": 47, "mean_score": 6.24, "sd": 1.17},
        {"min_age": 48, "max_age": 53, "mean_score": 6.48, "sd": 1.37},
        {"min_age": 54, "max_age": 59, "mean_score": 6.97, "sd": 1.26},
        {"min_age": 60, "max_age": 71, "mean_score": 7.33, "sd": 1.21},
        {"min_age": 72, "max_age": 83, "mean_score": 8.05, "sd": 1.42},
        {"min_age": 84, "max_age": 107, "mean_score": 8.87, "sd": 1.19},
        {"min_age": 108, "max_age": 131, "mean_score": 9.7, "sd": 1.4},
    ],
    "cps": [
        {"min_age": 36, "max_age": 41, "mean_score": 1.09, "sd": 0.13},
        {"min_age": 42, "max_age": 47, "mean_score": 1.15, "sd": 0.11},
        {"min_age": 48, "max_age": 53, "mean_score": 1.19, "sd": 0.13},
        {"min_age": 54, "max_age": 59, "mean_score": 1.21, "sd": 0.11},
        {"min_age": 60, "max_age": 71, "mean_score": 1.29, "sd": 0.13},
        {"min_age": 72, "max_age": 83, "mean_score": 1.36, "sd": 0.14},
        {"min_age": 84, "max_age": 107, "mean_score": 1.34, "sd": 0.14},
        {"min_age": 108, "max_age": 131, "mean_score": 1.37, "sd": 0.15},
    ],
}


def get_norms(age_y: int, age_m: int, metric: str):
    data = norms[metric]

    age = 12 * age_y + age_m
    mean = None
    sd = None
    for d in data:
        if age >= d["min_age"] and age < d["max_age"]:
            mean = d["mean_score"]
            sd = d["sd"]

    return mean, sd


def is_within_norms(score: float, age_y: int, age_m: int, metric: str):
    """
    TODO: handle none mean and sd
    """
    mean, sd = get_norms(age_y, age_m, metric)
    meets_criteria = score > (mean - SD_WITHIN_NORM * sd)
    if score == np.inf:
        meets_criteria = None
    return meets_criteria
