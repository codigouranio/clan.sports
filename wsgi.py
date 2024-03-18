"""Application entry point."""

from dotenv import load_dotenv

load_dotenv()

from app import create_app

app = create_app()
