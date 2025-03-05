import Levenshtein


class BKTree:
    def __init__(self, words):
        self.tree = None
        self.build_tree(words)

    def build_tree(self, words):
        """Constructs the BK-tree from a list of words."""
        if not words:
            return
        self.tree = (words[0], {})  # Root node
        for word in words[1:]:
            self._insert(self.tree, word)

    def _insert(self, node, word):
        root_word, children = node
        dist = Levenshtein.distance(root_word, word)
        if dist in children:
            self._insert(children[dist], word)
        else:
            children[dist] = (word, {})

    def search(self, query, max_distance):
        """Searches for words within the given Levenshtein distance."""
        if not self.tree:
            return []
        return self._search(self.tree, query, max_distance)

    def _search(self, node, query, max_distance):
        root_word, children = node
        results = []
        dist = Levenshtein.distance(query, root_word)
        if dist <= max_distance:
            results.append((root_word, dist))

        # Only search relevant branches
        for d in range(dist - max_distance, dist + max_distance + 1):
            if d in children:
                results.extend(self._search(children[d], query, max_distance))
        return results
