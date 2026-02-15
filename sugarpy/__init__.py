from .morphemes import MorphologyCounter
from .sentences import SentenceCounter
from .metrics import get_metrics
from .norms import get_norms, is_within_norms
from .enum import MetricName

import importlib

__all__ = [
    "MorphologyCounter",
    "SentenceCounter",
    "get_metrics",
    "get_norms",
    "is_within_norms",
    "MetricName",
]

__version__ = importlib.metadata.version("sugar-python")
