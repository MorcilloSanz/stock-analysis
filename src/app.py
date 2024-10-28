from flask import Flask, render_template

from stock import stock


# Initialize the Flask app
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

app.register_blueprint(stock)


# Define a route for the home page
@app.route('/')
def home():
    return render_template('index.html')


# Run the app
if __name__ == '__main__':
    app.run(debug=True)