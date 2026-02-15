from sugarpy import MorphologyCounter
from sugarpy import SentenceCounter
from sugarpy.config import DEFAULT_MODEL
from pydantic import BaseModel
from typing import List
import numpy as np


class SugarMetrics(BaseModel):
    sample: str
    morpheme_split_sample: str
    clause_split_sample: str
    utterances: int
    morphemes: int
    words: int
    words_in_sentences: int
    sentences: int
    clauses: int

    def __add__(self, other):
        return SugarMetrics(
            sample=self.sample + "\n" + other.sample,
            morpheme_split_sample=self.morpheme_split_sample
            + "\n"
            + other.morpheme_split_sample,
            clause_split_sample=self.clause_split_sample
            + "\n"
            + other.clause_split_sample,
            utterances=self.utterances + other.utterances,
            morphemes=self.morphemes + other.morphemes,
            words=self.words + other.words,
            words_in_sentences=self.words_in_sentences + other.words_in_sentences,
            sentences=self.sentences + other.sentences,
            clauses=self.clauses + other.clauses,
        )

    def __radd__(self, other):
        if other == 0:
            return self
        return self.__add__(other)

    @property
    def mlu(self):
        if self.utterances:
            return self.morphemes / self.utterances
        else:
            return np.inf

    @property
    def tnw(self):
        return self.words

    @property
    def wps(self):
        if self.sentences:
            return self.words_in_sentences / self.sentences
        else:
            return np.inf

    @property
    def cps(self):
        if self.sentences:
            return self.clauses / self.sentences
        else:
            return np.inf


def get_metrics(
    input_samples: List[str], consolidate: bool = True, model=None
) -> SugarMetrics:
    """
    Main metrics function.
    """
    model = model or DEFAULT_MODEL
    cm = MorphologyCounter(model_name=model)
    cs = SentenceCounter(nlp=cm.nlp)
    computed_metrics = []

    for utterance in input_samples:
        if utterance.strip():
            morph_line, num_morph, num_words = cm.count(utterance.strip())
            num_sent, num_clauses, num_words, words_in_sentences, clause_line = (
                cs.count(utterance.strip())
            )

            m = SugarMetrics(
                sample=utterance.strip(),
                morpheme_split_sample=morph_line,
                clause_split_sample=clause_line,
                utterances=1,
                morphemes=num_morph,
                words=num_words,
                sentences=num_sent,
                words_in_sentences=words_in_sentences,
                clauses=num_clauses,
            )
            computed_metrics.append(m)

    if consolidate:
        return sum(computed_metrics)
    return computed_metrics
