import json
import os
from io import BytesIO
from pathlib import Path

import git
import markdown
from flask import Flask, jsonify, send_file
from git import Repo
import polars as pl


class DatabaseJupyter:
    REPO_URL = "https://<TOKEN>@github.com/codigouranio/mark_investment_engine.git"
    REPO_FOLDER = "./mark_investment_engine"
    REPO_SUB_FOLDER = "clan-sports"
    STATES_FILE = "states.json"
    YEARS_FILE = "years.json"
    GENDERS_FILE = "genders.json"
    TEAM_LIST_FILE = "teams.json"
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

        db_path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.TEAM_LIST_FILE,
        )

        print(db_path_file)

        temp_df = pl.read_json(db_path_file)

        # Melt the DataFrame to convert columns to rows
        # Specify the id_vars as the index you want to keep (e.g., club names)
        melted_df = temp_df.melt(id_vars=None)  # None means no fixed identifier

        # exploded_df = melted_df.explode("value")

        # Now, if 'value' is a struct, extract fields
        self.df = melted_df.select(
            [
                pl.col("variable").alias("club_name"),
                pl.col("value").struct.field("state").alias("state"),
                pl.col("value").struct.field("logo_url").alias("logo_url"),
                pl.col("value").struct.field("info").alias("info"),
            ]
        )

        # # Print the melted DataFrame
        # print("\nMelted DataFrame:")
        # print(self.df)

        # Count total rows
        total_rows = self.df.shape[0]
        print(f"Total rows: {total_rows}")

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
        origin.pull()

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

        with open(
            os.path.join(
                DatabaseJupyter.REPO_FOLDER,
                DatabaseJupyter.REPO_SUB_FOLDER,
                DatabaseJupyter.TEAM_LIST_FILE,
            ),
            "r",
        ) as file:
            self.teams = json.load(file)

        # Load data from the database to memory
        print("loading data from database")
        pass

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

        # print([{**club, "html_info": markdown.markdown(club.info)} for club in res])

        return jsonify(transformed_clubs)

    def searchClubsBySearchTerm(self, search_term):
        search_term_lower = search_term.lower()

        conditions = [
            self.df[col].str.to_lowercase().str.contains(search_term_lower)
            for col in self.df.columns
            if self.df.schema[col] == pl.Utf8  # Apply to string columns only
        ]

        if conditions:
            combined_condition = conditions[0]
            for condition in conditions[1:]:
                combined_condition |= condition
            results = self.df.filter(combined_condition)
        else:
            results = self.df.head(0)

        print("Searching", search_term, self.df.columns)

        page = 0
        page_size = 30

        # Calculate start and end indices for pagination
        start = (page - 1) * page_size

        # Slice the DataFrame for pagination
        paginated_results = results.slice(start, page_size)

        transformed_clubs = [
            {
                "club_name": club["club_name"],
                "state": club["state"],
                "info": markdown.markdown(club["info"]),
            }
            for club in paginated_results.to_dicts()
        ]

        return transformed_clubs

    def getClubLogo(self, logoPath: str):
        res = None
        path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.TEAMS_FOLDER,
            logoPath,
        )

        if not os.path.exists(path_file):
            return res, 404

        path_file = Path(__file__).resolve().parent.parent.parent / path_file
        res = send_file(path_file, mimetype="image/jpeg")
        return res, 200
