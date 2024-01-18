from pydantic import BaseModel
from typing import Dict, Any
import json

class ManualMorphemeRule(BaseModel):
    word: str
    processed: str
    score: int

class MorphemeRules:
    def __init__(self, rules: Dict[str, ManualMorphemeRule]):
        self.rules = rules

    @classmethod
    def from_dict(self, d: Dict[str,Any]):
        rules = {}
        for k,v in d.items():
            rules[k] = ManualMorphemeRule.parse_obj(v)
        return MorphemeRules(rules)

    @classmethod
    def from_db(self):
        raise NotImplementedError

    def __contains__(self, key: str):
        return key in self.rules

    def __setitem__(self, key, value):
        raise Exception("Cannot set new rules using an instance")

    def __getitem__(self, key):
        return self.rules[key.lower()]


# Manually curated exceptions. Eventually move this to a db
exceptions = {
    "many": {
        "word": "many",
        "processed": "many",
        "score": 1
    }
}

morpheme_rules = MorphemeRules.from_dict(exceptions)
