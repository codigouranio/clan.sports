from datetime import datetime
from pathlib import Path

import toml


class AppInfo:
    def __init__(self) -> None:
        self.app_name = None
        self.app_version = None
        self.app_version_date = None

        config_path = Path(__file__).resolve().parent.parent / "pyproject.toml"

        with open(config_path, "r") as f:
            config = toml.load(f)
            self.app_name = config.get("tool").get("poetry").get("name")
            self.app_version = config.get("tool").get("poetry").get("version")
            self.app_version_date = f"{datetime.now().month}-{datetime.now().year}"
