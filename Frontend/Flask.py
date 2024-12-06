from flask import Flask, render_template, make_response, request, jsonify
import os
import requests
from config import Config
app = Flask(
    __name__,
    template_folder=os.path.abspath(Config.TEMPLATE_FOLDER),
    static_folder=os.path.abspath(Config.STATIC_FOLDER),
)
app.config.from_object(Config)
