import os  # noqa: I001

from config import Config
from flask import Flask
from database import test
app = Flask(
    __name__,
    template_folder=os.path.abspath(Config.TEMPLATE_FOLDER),
    static_folder=os.path.abspath(Config.STATIC_FOLDER),
)
app.config.from_object(Config)
