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

        return

        self.loadTeamListToMemory()

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

    def loadTeamListToMemory(self):
        # Define the path to the JSON file
        db_path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.TEAM_LIST_FILE,
        )

        temp_df = pd.read_json(db_path_file, orient="index").reset_index()
        self.df = temp_df.rename(columns={"index": "club_name"})

        # Count total rows
        total_rows = self.df.shape[0]
        print(f"Total rows: {total_rows}")

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

        # print([{**club, "html_info": markdown.markdown(club.info)} for club in res])

        return jsonify(transformed_clubs)

    def searchClubsBySearchTerm(self, search_term, page=0, page_size=30):
        # Define the path to the JSON file
        db_path_file = os.path.join(
            DatabaseJupyter.REPO_FOLDER,
            DatabaseJupyter.REPO_SUB_FOLDER,
            DatabaseJupyter.TEAM_LIST_FILE,
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
        }

        return response_object

        # # Convert the search term to lowercase
        # search_term_lower = search_term.lower()
        # print("Filtering by search term:", search_term_lower)

        # # Build conditions to filter by search term in each string column
        # conditions = [
        #     self.df[col].str.lower().str.contains(search_term_lower, na=False)
        #     for col in self.df.select_dtypes(
        #         include="object"
        #     ).columns  # Apply only to string columns
        # ]

        # # Combine conditions with OR logic if there are any conditions
        # if conditions:
        #     combined_condition = conditions[0]
        #     for condition in conditions[1:]:
        #         combined_condition |= condition
        #     results = self.df[combined_condition]
        # else:
        #     results = self.df.head(0)

        # # print("Results", results)
        # # print("Searching", search_term, self.df.columns)

        # # Set pagination parameters
        # page = 0
        # page_size = 30
        # start = page * page_size

        # print("Slicing data", page, page_size, start)

        # # Slice the DataFrame for pagination
        # paginated_results = results.iloc[start : start + page_size]

        # # Transform results into the desired output structure
        # res = [
        #     {
        #         "club_name": _["club_name"],
        #         "info": markdown.markdown(_["info"]),
        #         "state": _["state"],
        #         "logo_url": _["logo_url"],
        #     }
        #     for _ in paginated_results.to_dict(orient="records")
        # ]

        # # Create a response object
        # response_object = {
        #     "status": "success",
        #     "items": res,
        # }

        # return response_object

        # # Transform results into the desired output structure
        # transformed_clubs = [
        #     {
        #         "club_name": club["club_name"],
        #         "state": club["state"],
        #         "info": markdown.markdown(club["info"]),
        #     }
        #     for _, club in paginated_results.iterrows()
        # ]

        # print("Transformed results", transformed_clubs)

        # return transformed_clubs

    def filter_clubs(self, filename, term, page=0, page_size=30):

        term = term.lower()
        cur = -1
        with open(filename, "r") as file:
            # Use ijson to parse the JSON array item by item
            for key, values in ijson.kvitems(file, ""):
                cur += 1

                if page * page_size > cur:
                    continue

                if cur >= (page + 1) * page_size:
                    break

                if any(term in str(values[innerKey]).lower() for innerKey in values):
                    yield {
                        "club_name": key,
                        "state": values["state"],
                        "info": markdown.markdown(values["info"]),
                    }

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
