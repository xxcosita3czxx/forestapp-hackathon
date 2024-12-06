from flask import Flask, jsonify
app = Flask(
    __name__,
    template_folder=os.path.abspath(Config.TEMPLATE_FOLDER),
    static_folder=os.path.abspath(Config.STATIC_FOLDER)
)