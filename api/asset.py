from model import AssetRequest, AssetType
from draw import get_bellcurves
import numpy as np


def get_asset_from_request(request: AssetRequest):
    scores = {k: v for k, v in request.scores.items() if v is not None and v < np.inf}
    if request.type == AssetType.BELL_CURVE:
        return get_bellcurves(
            scores,
            request.age.years,
            request.age.months,
            file_format=request.response_format,
        )
    elif request.type == AssetType.Metric_TABLE:
        return get_metric_table(
            scores,
            request.age.years,
            request.age.months,
            file_format=request.response_format,
        )
    else:
        raise ValueError("Unrecognized asset type")


def get_metric_table(scores, age, format="png"):
    """
    Get the scores shown in a results table.
    """
    pass
