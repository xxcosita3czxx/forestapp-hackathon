import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    TEMPLATE_FOLDER = "Frontend"
    STATIC_FOLDER = "Frontend"
    TEMPLATES_AUTO_RELOAD = True
    SQLALCHEMY_DATABASE_URI =  'sqlite:///' + os.path.join(basedir, 'db.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

