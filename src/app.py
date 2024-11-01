from flask import Flask, render_template
from flask_cors import CORS

from database.database import *

from view.stock import stock


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(stock)


@app.route('/')
def home():
    return render_template('index.html')


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