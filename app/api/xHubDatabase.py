import hashlib
import json
from os import path
import re
from collections import defaultdict

from flask import Flask
from git import Repo

REPO_URL = "https://<TOKEN>@github.com/codigouranio/mark_investment_engine.git"
DATABASE_FOLDER = "clan-sports"
DATABASE_PATH = "__database.json"
INDEX_PATH = "__index.json"
REVERSE_INDEX_PATH = "__reverse_index.json"
REPO_FOLDER = "./mark_investment_engine"


class XHubDatabase:
    def __init__(self, app: Flask) -> None:
        self.app = app
        self.repoUrl = REPO_URL.replace("<TOKEN>", app.config.get("SEC_REPO_TOKEN"))

        self.repo = Repo(REPO_FOLDER)

        self.repo.remotes.origin.fetch()
        self.repo.remotes.origin.pull()

        print(
            "done!",
        )

    def load_json(self, file_path):
        """Load JSON data from a file."""
        try:
            with open(path.join(REPO_FOLDER, DATABASE_FOLDER, file_path), "r") as file:
                return json.load(file)
        except FileNotFoundError:
            return (
                {"documents": {}, "hashes": {}}
                if "database" in file_path
                else {"titles": {}, "terms": {}}
            )
        except json.JSONDecodeError:
            return {}

    def save_json(self, file_path, data):
        """Save JSON data to a file."""
        with open(path.join(REPO_FOLDER, DATABASE_FOLDER, file_path), "w") as file:
            json.dump(data, file, indent=4)

    def tokenize(self, text):
        """Convert text into a list of normalized terms."""
        return re.findall(r"\w+", text.lower())

    def generate_hash(self, content):
        """Generate a unique hash for the given content."""
        return hashlib.md5(content.encode("utf-8")).hexdigest()

    def update_reverse_index(self, reverse_index, doc_id, content):
        """Update the reverse index with terms from the document content."""
        terms = self.tokenize(content)
        for term in terms:
            if doc_id not in reverse_index.get(term, []):
                reverse_index.setdefault(term, []).append(doc_id)

    def add_document(self, doc_id, doc_key, doc):
        """Add a new document, check for duplicates, and update indices."""

        self.repo.remotes.origin.fetch()
        self.repo.remotes.origin.pull()

        database = self.load_json(DATABASE_PATH)
        index = self.load_json(INDEX_PATH)

        doc_hash = self.generate_hash(doc)

        # Check for duplicates using the hash
        if doc_hash in database.get("hashes", {}):
            existing_doc_id = database["hashes"][doc_hash]
            print(
                f"Duplicate document detected! Already exists as '{existing_doc_id}'."
            )
            return

        # Add document to database
        database["documents"][doc_id] = doc
        database.setdefault("hashes", {})[doc_hash] = doc_id
        self.save_json(DATABASE_PATH, database)

        # Update forward index
        index.setdefault("doc_key", {})[doc_key] = doc_id

        # Update reverse index
        reverse_index = index.get("terms", defaultdict(list))
        self.update_reverse_index(reverse_index, doc_id, doc)
        index["terms"] = reverse_index

        self.save_json(INDEX_PATH, index)

        if self.repo.is_dirty():
            self.repo.index.add(path.join(REPO_FOLDER, DATABASE_FOLDER, DATABASE_PATH))
            self.repo.index.add(path.join(REPO_FOLDER, DATABASE_FOLDER, INDEX_PATH))
            self.repo.index.commit("wip")
            self.repo.push()

        print(f"Document '{doc_key}' added successfully.")
