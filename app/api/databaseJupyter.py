import hashlib
import json
import ijson
import os
from io import BytesIO
from pathlib import Path

import git
import markdown
from flask import Flask, jsonify, send_file
from git import Repo
import pandas as pd


class DatabaseJupyter:
    REPO_URL = "https://<TOKEN>@github.com/codigouranio/mark_investment_engine.git"
    REPO_FOLDER = "./mark_investment_engine"
    REPO_SUB_FOLDER = "clan-sports"
    STATES_FILE = "states.json"
    YEARS_FILE = "years.json"
    GENDERS_FILE = "genders.json"
    CLUBS_AND_TEAMS_FILE = "clubs_and_teams.json"
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
            print("Cloning database repository...")
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
            repo.git.pull()  # or repo.git.merge('branch_name')

        except git.exc.GitCommandError as e:
            print(f"Git command error: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

        origin = repo.remotes.origin
        origin.fetch()

        # Get the branch name
        branch_name = "main"
        repo.git.reset("--hard", f"origin/{branch_name}")

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
                DatabaseJupyter.GENDERS_FILE,
            ),
            "r",
        ) as file:
            self.genders = json.load(file)

        # with open(
        #     os.path.join(
        #         DatabaseJupyter.REPO_FOLDER,
        #         DatabaseJupyter.REPO_SUB_FOLDER,
        #         DatabaseJupyter.CLUBS_AND_TEAMS_FILE,
        #     ),
        #     "r",
        # ) as file:
        #     self.teams_and_clubs = json.load(file)

        return

        # Melt the DataFrame to convert columns to rows
        # Specify the id_vars as the index you want to keep (e.g., club names)
        melted_df = temp_df.melt(id_vars=None)  # None means no fixed identifier

        print(melted_df.columns)

        # If 'value' is a column containing dictionaries, expand it into separate columns
        exploded_df = pd.json_normalize(melted_df["value"]).join(melted_df["variable"])

        # Rename columns to match the desired structure
        exploded_df = exploded_df.rename(
            columns={
                "variable": "club_name",
                "state": "state",
                "logo_url": "logo_url",
                "info": "info",
            }
        )

        # Assign the resulting DataFrame to self.df
        self.df = exploded_df

        # Print the melted DataFrame if needed
        # print("\nMelted DataFrame:")
        # print(self.df)

        # Count total rows
        total_rows = self.df.shape[0]
        print(f"Total rows: {total_rows}")

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

    def searchClubsBySearchTerm(self, search_term, page=0, page_size=30):

        # Define the path to the JSON file
        db_path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.CLUBS_AND_TEAMS_FILE,
        )

        items = []

        print("Filtering by search term:", search_term, db_path_file)

        for filtered_item in self.filter_clubs(
            db_path_file, search_term, page, page_size
        ):
            items.append(filtered_item)

        # Create a response object
        response_object = {
            "status": "success",
            "items": items,
            "total": len(items),
            "page": page,
            "page_size": page_size,
            "search_term": search_term,
            "more_results": len(items) == page_size,
        }

        return response_object

    def filter_clubs(self, filename, term, page=0, page_size=30):

        term = term.lower()
        cur = -1

        print(page_size)

        with open(filename, "r") as file:
            # Use ijson to parse the JSON array item by item
            for key, values in ijson.kvitems(file, ""):
                if any(term in str(values[innerKey]).lower() for innerKey in values):
                    cur += 1

                    if page * page_size > cur:
                        continue

                    if cur >= (page + 1) * page_size:
                        break

                    yield {
                        "club_name": key,
                        "state": values["state"],
                        "info": markdown.markdown(values["info"]),
                        "image_file": values["image_file"],
                        "rank": values["rank_num"],
                        "last_update": values["last_update"],
                        "teams": [team for team in values["teams"].values()],
                    }

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
