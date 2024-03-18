import logging
from datetime import timedelta

DEBUG = True
TESTING = True
SECRET_KEY = "fe339b49-d1c9-499d-a6e1-193124697c9b"
SESSION_TYPE = "filesystem"
SESSION_PERMANENT = True
PERMANENT_SESSION_LIFETIME = timedelta(days=31)
SESSION_COOKIE_SAMESITE = None
SESSION_COOKIE_SECURE = True
JWT_ALGORITHM = "HS256"
COMPRESSOR_DEBUG = False
APP_DATABASE = "sqlite:///database.db"
MAX_COOKIE_SIZE = 4093
LOGGER_LEVEL = logging.DEBUG
