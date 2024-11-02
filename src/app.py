from flask import Flask, render_template
from flask_cors import CORS

from database.database import *

from view.stock import stock
from view.auth_view import auth


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(stock)
app.register_blueprint(auth)


@app.route('/')
def index():
    return render_template('login.html')


@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/register')
def register():
    return render_template('register.html')


def generate_database() -> None:
    """
    Generates a new database if not exists and registers the ADMIN user.
    """
    database: DataBase = DataBase.get_instance()

    if not database.exists():
        database.open_connection()
        database.create_database()
        database.close_connection()


if __name__ == '__main__':

    generate_database()
    app.run(debug=True)