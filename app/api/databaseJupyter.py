import gzip
import hashlib
import json
import os
import pickle
import sys
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path

import git
import ijson
import jellyfish
import Levenshtein
import markdown
import pandas as pd
import spacy
from flask import Flask, jsonify, send_file
from fuzzywuzzy import fuzz, process
from git import Repo
from rapidfuzz.distance import JaroWinkler

from .bktree import BKTree
from .seacher import Searcher


class DatabaseJupyter:
    REPO_URL = "https://<TOKEN>@github.com/codigouranio/mark_investment_engine.git"
    REPO_FOLDER = "./mark_investment_engine"
    REPO_SUB_FOLDER = "clan-sports"
    STATES_FILE = "states.json"
    YEARS_FILE = "years.json"
    GENDERS_FILE = "genders.json"
    CLUBS_AND_TEAMS_FILE = "data_inv_index.json"
    TEAMS_FOLDER = "data/states"
    TEAMS_SUB_FOLDER = "teams"
    TEAMS_FILE = "teams_data_enriched.json"

    def __init__(self, app: Flask) -> None:
        self.app = app
        if "SEC_REPO_TOKEN" in app.config.keys() and app.config.get("SEC_REPO_TOKEN"):
            self.repoUrl = DatabaseJupyter.REPO_URL.replace(
                "<TOKEN>", app.config.get("SEC_REPO_TOKEN")
            )
        else:
            self.repoUrl = DatabaseJupyter.REPO_URL.replace("<TOKEN>", "")

        self.loadDataToMemory()

    def loadDataToMemory(self):
        repoFolder = os.path.join(DatabaseJupyter.REPO_FOLDER)
        if not os.path.exists(repoFolder):
            print("Cloning database repository...", self.repoUrl)
            Repo.clone_from(self.repoUrl, DatabaseJupyter.REPO_FOLDER)

        repo = Repo(DatabaseJupyter.REPO_FOLDER)

        try:
            # Check the status to see modified files
            print("Checking for local changes...")
            if repo.is_dirty():
                # Stage and commit changes
                repo.git.add(A=True)  # Stage all changes
                repo.index.commit("service changes")  # Commit the changes
                print("Local changes have been committed.")
                repo.git.push()  # Push changes

            # Now you can safely pull or merge
            repo.git.fetch()  # Pull
            repo.git.pull()  # or repo.git.merge('branch_name')
            # repo.git.reset()

        except git.exc.GitCommandError as e:
            print(f"Git command error: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

        origin = repo.remotes.origin
        origin.fetch()

        # Get the branch name
        branch_name = "main"
        repo.git.reset("--hard", f"origin/{branch_name}")

        self.data = {}
        data_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            "data_inv_index.json",
        )
        with open(data_file, "r", encoding="utf-8") as json_file:
            self.data = json.load(json_file)

        print("Loaded %s items" % len(self.data))

        map_data_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            "map.pk.gz",
        )

        # BKTree.__module__ = "BKTree"
        sys.modules["__main__"].BKTree = BKTree
        sys.modules["__main__"].Searcher = Searcher

        self.root = {}
        with gzip.open(map_data_file, "rb") as file:
            self.root = pickle.load(file)

        # print(sorted(self.root["bk_tree"].search("premier", 2), key=lambda x: x[1])[:5])
        # print(sorted(self.root["bk_tree"].search("nj", 2), key=lambda x: x[1])[:5])
        # print(sorted(self.root["bk_tree"].search("2014", 2), key=lambda x: x[1])[:15])
        # print(len(self.root["index_by_state"]))
        # print(self.root["searcher"].searchByWords("nj premier"))
        # print(self.root["searcher"].searchByPos("nj premier 2014"))

        with open(
            os.path.join(
                DatabaseJupyter.REPO_FOLDER,
                DatabaseJupyter.REPO_SUB_FOLDER,
                DatabaseJupyter.STATES_FILE,
            ),
            "r",
        ) as file:
            self.states = json.load(file)

        with open(
            os.path.join(
                DatabaseJupyter.REPO_FOLDER,
                DatabaseJupyter.REPO_SUB_FOLDER,
                DatabaseJupyter.YEARS_FILE,
            ),
            "r",
        ) as file:
            self.years = json.load(file)

        with open(
            os.path.join(
                DatabaseJupyter.REPO_FOLDER,
                DatabaseJupyter.REPO_SUB_FOLDER,
                DatabaseJupyter.GENDERS_FILE,
            ),
            "r",
        ) as file:
            self.genders = json.load(file)

        with open(
            os.path.join(
                DatabaseJupyter.REPO_FOLDER,
                DatabaseJupyter.REPO_SUB_FOLDER,
                DatabaseJupyter.STATES_FILE,
            ),
            "r",
        ) as file:
            self.states = json.load(file)

    def getState(self):
        return self.states

    def getYears(self):
        return self.years

    def getGenders(self):
        return self.genders

    def searchClubs(self, state: str, gender: str, year: int):
        res = {}
        path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.TEAMS_FOLDER,
            state,
            gender,
            str(year),
            DatabaseJupyter.TEAMS_SUB_FOLDER,
            DatabaseJupyter.TEAMS_FILE,
        )

        if not os.path.exists(path_file):
            return jsonify(res)

        with open(
            path_file,
            "r",
        ) as file:
            res = json.load(file)

        transformed_clubs = [
            {
                "club_name": club["club_name"],
                "team_name": club["team_name"],
                "image_file": os.path.join(
                    state,
                    gender,
                    str(year),
                    DatabaseJupyter.TEAMS_SUB_FOLDER,
                    club["image_file"],
                ),
                "rank": club["rank_num"],
                "info": markdown.markdown(club["info"]),
            }
            for club in res
        ]

        return jsonify(transformed_clubs)

    def searchByTerm(self, search_term, state, page=0, page_size=10):
        ret = []

        ret = self.root["searcher"].searchByPos(search_term, state)
        start_index = page * page_size
        end_index = start_index + page_size

        return {
            "items": [
                {**item, "info": self.processInfo(search_term, item["info"])}
                for item in ret[start_index:end_index]
            ],
            "metadata": {
                "page": page,
                "page_size": page_size,
                "total": len(ret),
                "search_term": search_term,
                "state": state,
                "more_results": page_size * (page + 1) < len(ret),
            },
        }

    def searchItemByUniqueId(self, unique_id):
        if unique_id in self.root["index_by_uuid"]:
            item = self.root["index_by_uuid"][unique_id]
            item = {**item, "info": self.processInfo("", item["info"], -1)}

            if item["item_type"] == "CLUB":
                item["teams"] = list(
                    map(
                        lambda x: {
                            **self.root["index_by_uuid"][x],
                            "total_players": len(
                                self.root["index_by_uuid"][x].get("players", [])
                            ),
                        },
                        filter(
                            lambda x: x in self.root["index_by_uuid"], item["teams"]
                        ),
                    )
                )

            if item["item_type"] == "TEAM":
                item["players"] = list(
                    map(
                        lambda x: {
                            **self.root["index_by_uuid"][x],
                        },
                        filter(
                            lambda x: x in self.root["index_by_uuid"], item["players"]
                        ),
                    )
                )

                item["coaches"] = list(
                    map(
                        lambda x: self.root["index_by_uuid"][x],
                        filter(
                            lambda x: x in self.root["index_by_uuid"], item["coaches"]
                        ),
                    )
                )

            return item

        return {}, 404

    def filter_items(self, filename, term, state, page=0, page_size=30):

        term = term.lower()
        cur = -1
        count_results = {}

        with open(filename, "r") as file:
            for key, values in ijson.kvitems(file, ""):

                similarity_score = 0
                best_match_result = ""

                if state and len(state) > 0 and state != values["state"]:
                    continue

                if term and len(term) > 0:
                    found, best_match, score = self.find_similar_substrings(term, key)
                    # print(found, best_match, score)
                    if found:
                        best_match_result = best_match
                        similarity_score = max(similarity_score, score)

                    # found, best_match, score = self.find_similar_substrings(
                    #     term, values["info"]
                    # )
                    # if found:
                    #     best_match_result = best_match
                    #     similarity_score = max(similarity_score, score)

                    # found, best_match, score = self.find_similar_substrings(
                    #     term, values["state"]
                    # )
                    # if found:
                    #     best_match_result = best_match
                    #     similarity_score = max(similarity_score, score)

                else:
                    similarity_score = 0

                if 0 < similarity_score <= 1.0:

                    if not values["item_type"] in count_results:
                        count_results[values["item_type"]] = 0

                    count_results[values["item_type"]] += 1

                    cur = min(count_results.values())

                    if page * page_size > cur:
                        continue

                    if cur >= (page + 1) * page_size:
                        break

                    search_title = key
                    if values["item_type"] == "CLUB":
                        search_title = f"{values['name']}"
                        similarity_score = 1.0
                    if values["item_type"] == "TEAM":
                        search_title = f"{values['name']}"
                        similarity_score = 0.1
                    if values["item_type"] == "PLAYER":
                        search_title = f"{values['first_name']} {values['last_name']}"
                        similarity_score = 0.1
                    if values["item_type"] == "COACH":
                        search_title = f"{values['full_name']}"
                        similarity_score = 0.1

                    yield {
                        "item_name": key,
                        "unique_id": values["unique_id"],
                        "state": values["state"],
                        "info": self.processInfo(term, values["info"]),
                        "image_file": values["image_file"],
                        "rank": values["rank_num"],
                        "last_update": values["last_update"],
                        "item_type": values["item_type"],
                        "similarity_score": round(similarity_score, 5),
                        "search_title": f"{search_title}",
                        "best_match": best_match_result,
                        "meta": {},
                    }

    def processInfo(self, term, info, word_limit=75):
        res = ""

        len_term = len(term) if len(term) > 0 else 1

        i = 0
        while i <= len(info) - len_term:
            next_word = info[i : i + len_term]
            if term == next_word.lower() and len(term) > 0:
                res += f"*{next_word}*"
                i += len(term)
            elif info[i] == "[":
                j = i + 1
                while j < len(info) and info[j] != "]":
                    j += 1
                if j < len(info) and info[j] == "]":
                    res += info[i : j + 1]
                    i = j + 1
            elif info[i] == "(":
                j = i + 1
                while j < len(info) and info[j] != ")":
                    j += 1
                if j < len(info) and info[j] == ")":
                    res += info[i : j + 1]
                    i = j + 1
            elif info[i : i + 4] == "http" and i <= len(info) - 4:
                j = i
                while j < len(info) and self.is_valid_url_char(info[j]):
                    j += 1
                if j <= len(info):
                    res += f"[link]({info[i:j]})"
                    i = j
            else:
                res += info[i]
                i += 1

        if word_limit > 0:
            words = res.split()
            res = (
                " ".join(words[:word_limit]) + "..." if len(words) > word_limit else res
            )

        return markdown.markdown(res)

    def is_valid_url_char(self, char):
        # Define valid characters for a URL
        url_valid_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~:/?#[]@!$&'()*+,;=%"

        # Check if the character is in the valid URL character set
        return char in url_valid_chars

    def getClubLogo(self, logoPath: str):
        file_path = os.path.join(
            os.path.abspath(DatabaseJupyter.REPO_FOLDER),
            DatabaseJupyter.REPO_SUB_FOLDER,
            "logos",
            logoPath,
        )

        if not os.path.exists(file_path):
            return "Image not found", 404

        # Get last modified time
        last_modified_time = os.path.getmtime(file_path)

        # Create ETag using file content
        with open(file_path, "rb") as f:
            file_content = f.read()
            etag = hashlib.md5(file_content).hexdigest()

        # Send the file using send_file
        return send_file(
            path_or_file=file_path,
            mimetype="image/jpeg",  # Change this based on the actual image type
            as_attachment=False,  # Set to True if you want the browser to download the file
            conditional=True,  # Enable conditional requests (e.g., if-modified-since)
            etag=etag,  # Set ETag based on the file content
            last_modified=last_modified_time,  # Set Last-Modified header
            max_age=31536000,  # Cache for one year (in seconds)
        )

    def getClubInfo(self, club_name: str):
        # Define the path to the JSON file
        db_path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.CLUBS_AND_TEAMS_FILE,
        )

        with open(db_path_file, "r") as file:
            # Use ijson to parse the JSON array item by item
            for key, values in ijson.kvitems(file, ""):
                if key == club_name:
                    return jsonify(
                        {
                            "club_name": key,
                            "state": values["state"],
                            "info": self.processInfo("", values["info"], -1),
                            "image_file": values["image_file"],
                            "rank": values["rank_num"],
                            "last_update": values["last_update"],
                            "teams": [team for team in values["teams"].values()],
                            "type_item": "club",
                            "search_title": f"{key}",
                        }
                    )

        return {}, 404

    def getPlayer(self, player_key):
        return markdown.markdown("# Player Info")

    def getPlayerInfo(self, player_key):
        return (
            jsonify(
                {
                    "player_key": player_key,
                    "player_name": "Player Name",
                    "player_type": "Player Type",
                    "player_position": "Player Position",
                    "player_height": "Player Height",
                    "player_weight": "Player Weight",
                    "player_birthdate": "Player Birthdate",
                    "player_age": "Player Age",
                    "player_birthplace": "Player Birthplace",
                    "player_national": "Player National",
                    "player_club": "Player Club",
                    "player_image": "Player Image",
                    "player_info": "Player Info",
                    "player_rank": "Player Rank",
                    "player_last_update": "Player Last Update",
                    "player_teams": "Player Teams",
                    "type_item": "player",
                    "search_title": f"Player Name",
                    "similarity_score": 0,
                    "more_results": False,
                    "player_number": "Player Number",
                    "execution_time": 0,
                    "goalkeeper": "Goalkeeper",
                    "defender": "Defender",
                    "defender_midfielder": "Defender Midfielder",
                    "defender_midfielder_striker": "Defender Midfielder Striker",
                    "goals": "Goals",
                    "assists": "Assists",
                    "red_cards": "Red Cards",
                    "yellow_cards": "Yellow Cards",
                    "clean_sheets": "Clean Sheets",
                    "club_logo": "Club Logo",
                    "history": [
                        {
                            "year": "Year",
                            "team": "Team",
                            "appearances": "Appearances",
                            "goals": "Goals",
                            "assists": "Assists",
                            "yellow_cards": "Yellow Cards",
                            "red_cards": "Red Cards",
                            "clean_sheets": "Clean Sheets",
                        }
                    ],
                    "assets": [
                        {
                            "type": "trophy",
                            "name": "Trophy Name",
                            "description": "",
                            "value": "Trophy Value",
                            "image": "Trophy Image",
                        },
                        {
                            "Type": "award",
                            "name": "Award Name",
                            "description": "",
                            "value": "Award Name",
                            "image": "Award Image",
                        },
                        {
                            "type": "medal",
                            "name": "Medal Name",
                            "description": "",
                            "value": "Medal Value",
                            "image": "Medal Image",
                        },
                    ],
                }
            ),
            200,
        )

    def setPlayer(self, player_key, player_info):
        return jsonify({"message": f"Player {player_key} has been updated!"}), 200
