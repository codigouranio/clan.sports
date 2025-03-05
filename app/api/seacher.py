from collections import defaultdict

import Levenshtein
import spacy
from fuzzywuzzy import fuzz, process
from rapidfuzz.distance import JaroWinkler


class Searcher:
    def __init__(self, index, index_by_state, index_by_uuid, bk_tree):
        self.index = index
        self.index_by_uuid = index_by_uuid
        self.index_by_state = index_by_state
        self.bk_tree = bk_tree
        # Load spaCy's English model
        self.nlp = spacy.load("en_core_web_sm")

    def cutInPages(self, results, page=0, pageSize=20):
        start = page * pageSize
        end = start * pageSize
        return results[start:end]

    def searchByWords(self, query: str, state=None):
        words_prev = [
            token.lemma_ for token in self.nlp(query.lower()) if not token.is_stop
        ]
        if not words_prev:
            words_prev = set()

        words_similar = []
        for word in words_prev:
            t = sorted(self.bk_tree.search(word, 2), key=lambda x: x[1])
            words_similar.append(list(t)[:3])

        words = sorted(
            [item for items in words_similar for item in items], key=lambda x: x[1]
        )

        results = [
            set(self.index[word[0]].keys()) for word in words if word[0] in self.index
        ]

        possible_docs = set.union(*results) if results else set()

        if state and state in self.index_by_state:
            possible_docs = possible_docs.intersection(self.index_by_state[state])

        findings = list(possible_docs) if possible_docs else list()
        findings = findings if findings else list()

        return sorted(
            [self.index_by_uuid[doc_id] for doc_id in findings],
            key=lambda x: (x["item_type"], x["rank_num"]),
        )

    def searchByPos(self, query, state=None):
        words = [token.lemma_ for token in self.nlp(query.lower()) if not token.is_stop]
        if not words or any(word not in self.index for word in words):
            words = set()

        results = [set(self.index[word].keys()) for word in words]

        possible_docs = set.intersection(*results) if results else set()

        if state and state in self.index_by_state:
            possible_docs = possible_docs.intersection(self.index_by_state[state])

        possible_docs = possible_docs if possible_docs else set()

        findings = set()
        for doc_id in possible_docs:
            positions = [self.index[word][doc_id] for word in words]
            for start_pos in positions[0]:
                if all((start_pos + i) in pos for i, pos in enumerate(positions)):
                    findings.add(doc_id)
                    break

        if len(possible_docs) == 0 and len(self.index_by_state[state]) > 0:
            findings = self.index_by_state[state]

        return sorted(
            [self.index_by_uuid[doc_id] for doc_id in findings],
            key=lambda x: (x["item_type"], x["rank_num"]),
        )
