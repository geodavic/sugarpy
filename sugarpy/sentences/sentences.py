from sugarpy.config import SM_MODEL_NAME
from spacy.tokens.span import Span
from spacy.tokens.doc import Doc
from typing import Tuple, List
import re
import spacy
import sugarpy.claucy as claucy

from .sentence_splitter import optimal_partition


class SentenceCounter:
    marker_start = "<mark>"
    marker_end = "</mark>"

    def __init__(self, model_name=None, nlp=None):
        if nlp is not None:
            self.nlp = nlp
        else:
            self.nlp = spacy.load(model_name or SM_MODEL_NAME)
        claucy.add_to_pipe(self.nlp)

    def is_sentence(self, s: str) -> bool:
        """
        A sentence is defined as an utterance with at least one
        verb (auxillary verbs included) and a subject.

        TODO: count imperatives
        """
        verbs = [t.pos_ == "VERB" or t.pos_ == "AUX" for t in self.nlp(s)]

        subj_types = ["nsubj", "csubj", "nsubjpass", "csubjpass"]
        subjs = [t.dep_ in subj_types for t in self.nlp(s)]
        if sum(verbs) and sum(subjs):
            return True
        return False

    def preprocess(self, s: str) -> str:
        # remove newlines and extra spaces
        s = s.replace("\n", ". ")
        s = re.sub(r"\s+", " ", s)
        s = s.replace("’", "'")
        s = s.strip()

        return s

    def count_sentences(self, s: str) -> Tuple[List[Span], int]:
        sentences = []
        total_words = 0
        for sent in self.nlp(s).sents:
            if self.is_sentence(sent.text):
                sentences.append(sent)
                total_words += len(sent.text.split(" "))
        return sentences, total_words

    def count_clauses(self, sentence: str) -> Tuple[int, str]:
        """
        Count the clauses in a sentence. Assumes that the
        input is a complete sentence (and hence there must
        be at least one clause).

        Also returns the formatted string for the clauses
        """
        doc = self.nlp(sentence)
        clauses = doc._.clauses
        clauses_string = self._get_clauses_string(clauses, doc)
        return max(len(clauses), 1), clauses_string

    def _get_clauses_string(self, clauses: List[Tuple[str, ...]], sentence: Doc) -> str:
        clause_tuples = [
            [str(s) for s in list(c.to_propositions(as_text=False, inflect=None)[0])]
            for c in clauses
        ]
        words = [str(t) for t in sentence]
        _, partition = optimal_partition(words, clause_tuples)
        return "<br>".join(
            [
                self.marker_start + str(sentence[p[0] : p[1] + 1]) + self.marker_end
                for p in partition
            ]
        )

    def count(self, s: str) -> Tuple[int, int, int, int, str]:
        """
        Main counting method. Returns number of sentences,
        number of clauses, and number of words in an utterance.
        """
        s = self.preprocess(s)

        total_words = len(s.split(" "))
        sentences, words_in_sentences = self.count_sentences(s)
        total_clauses = 0
        clauses_strings = []
        for sent in sentences:
            clauses_count, clauses_string = self.count_clauses(sent.text)
            clauses_strings.append(clauses_string)
            total_clauses += clauses_count

        if total_clauses > 1:
            final_clauses_string = "<br>".join(clauses_strings)
        else:
            final_clauses_string = s

        return (
            len(sentences),
            total_clauses,
            total_words,
            words_in_sentences,
            final_clauses_string,
        )
