import os  # noqa: I001

from config import Config
from flask import Flask, make_response, render_template
from database import test
app = Flask(
    __name__,
    template_folder=os.path.abspath(Config.TEMPLATE_FOLDER),
    static_folder=os.path.abspath(Config.STATIC_FOLDER),
)
app.config.from_object(Config)
@app.route('/')
def index():
    testf = test.query.first()
    context = {
            "test":testf,
        }
    resp = make_response(render_template("index.html", **context))
    return resp
def main(port=5000,ip="127.0.0.1"):
    app.run(port=port,host=ip)
if __name__ == '__main__':
    main()
