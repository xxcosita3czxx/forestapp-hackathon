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
    resp = make_response(render_template("day.html", **context))
    return resp
def main(debug,cert,key,port=5000,ip="127.0.0.1"):
    if debug:
        if cert and key:
            context = (cert, key)
            app.run(debug=True,port=port,host=ip,ssl_context=context)  # noqa: S201
        else:
            app.run(debug=True,port=port,host=ip)  # noqa: S201
    else:
        if cert and key:
            context = (cert, key)
            app.run(port=port,host=ip,ssl_context=context)
        else:
            app.run(port=port,host=ip)
if __name__ == '__main__':
    main()
