from sugarpy import MorphologyCounter
from sugarpy import SentenceCounter
from sugarpy.norms import norms
from sugarpy.config import DEFAULT_MODEL
from pydantic import BaseModel
import numpy as np
import json


class SugarMetrics(BaseModel):
    utterances: int
    morphemes: int
    words: int
    words_in_sentences: int
    sentences: int
    clauses: int

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
        else
            return np.inf

    @property
    def cps(self):
        if self.sentences:
            return self.clauses / self.sentences
        else:
            return np.inf


def get_metrics(input_str: str):
    total_morphemes = 0
    total_utterances = 0
    total_sentences = 0
    total_clauses = 0
    total_words = 0
    total_words_in_sentences = 0

    lines = []
    cm = MorphologyCounter(model_name=DEFAULT_MODEL)
    cs = SentenceCounter(nlp=cm.nlp)

    for utterance in input_str.split("\n"):
        if utterance.strip():
            line, num_morph, num_words = cm.count(utterance.strip())
            total_morphemes += num_morph
            lines += [line]
            total_utterances += 1
            num_sent, num_clauses, num_words, words_in_sentences = cs.count(utterance.strip())
            total_words_in_sentences += words_in_sentences
            total_words += num_words
            total_sentences += num_sent
            total_clauses += num_clauses
    
    return SugarMetrics(
        utterances=total_utterances,
        morphemes=total_morphemes,
        words=total_words,
        sentences=total_sentences,
        words_in_sentences=total_words_in_sentences,
        clauses=total_clauses,
    ), lines

def get_norms(age_y: int, age_m: int, metric: str):
    data = norms[metric]

    age = 12*age_y + age_m
    mean = None
    sd = None
    for d in data:
        if age >= d['min_age'] and age < d['max_age']:
            mean = d['mean_score']
            sd = d['sd']

    return mean,sd
            
