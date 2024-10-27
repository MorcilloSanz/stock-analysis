from flask import Flask, jsonify, render_template

from stock import stock


# Initialize the Flask app
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

app.register_blueprint(stock)


# Define a route for the home page
@app.route('/')
def home():
    return render_template('index.html')


# Example API endpoint
@app.route('/api/data')
def data():
    # Sample JSON response
    return jsonify({
        "message": "Hello, this is your data!",
        "status": "success"
    })


# Run the app
if __name__ == '__main__':
    app.run(debug=True)