from controller.stock_controller import StockController

import pandas as pd
from flask import Blueprint, request, jsonify, make_response


stock = Blueprint('stock', __name__, url_prefix='/stock')


@stock.route('/tickers', methods=('GET', 'POST'))
def tickers_data():
	"""
    Handles requests to the '/tickers' endpoint.

    This function processes both GET and POST requests. It reads a CSV file containing ticker information,
    including ticker symbols and their corresponding names, and returns the data in JSON format.

    Returns:
        Response: A JSON response containing ticker data.
    """
	df = pd.read_csv('tickers.csv', header=None, names=["Ticker", "Name"], encoding='latin1')
	response = make_response(df.to_json())
	return response


@stock.route('/data', methods=('GET', 'POST'))
def stock_data():
	"""
    Retrieves stock data for a list of companies over the last year and returns it in JSON format.
    
    Uses yfinance to download stock data for the specified companies within the date range from
    one year ago to today.

    Returns:
        Response: A JSON response containing the stock data for the specified companies, with
                  CORS headers added.

	HTTP Headers:
		Authorization: the token of the user.

	Params:
		?tickers=AAPL,MSFT,GOOGL
    """
	companies_tickers: str = request.args.get('tickers')
	days: str = request.args.get('days')

	# Get companies data
	stock_controller: StockController = StockController()
	companies_data: pd.DataFrame = stock_controller.companies_data(companies_tickers, days=int(days))

	# Return response
	response = make_response(companies_data.to_json())
	return response


@stock.route('/stocks', methods=('GET', 'POST'))
def stocks():
	"""
	Retrieves the user's stock data based on the authorization token provided in the request headers.
	
	1. Extracts the authorization token from the request headers.
	2. Creates an instance of the StockController to handle the database connection.
	3. Opens the database connection.
	4. Attempts to fetch the user's stock data using the token.
	5. If unauthorized, returns a JSON response with an error message and a 401 status code.
	6. Closes the database connection after the operation.
	7. Returns a JSON response containing the user's stock data.

	HTTP Headers:
		Authorization: the token of the user.
	
	Returns:
		JSON response with user's stocks or an error if unauthorized.
	"""
	token: str = request.headers.get('Authorization')

	stock_controller: StockController = StockController()

	try:
		user_stocks = stock_controller.get_stocks(token)
		user_stocks = [dict(row) for row in user_stocks]
	except:
		return jsonify({'error' : 'unauthorized'}, 401)

	response = make_response(jsonify(user_stocks))
	return response


@stock.route('/add_stocks', methods=('GET', 'POST'))
def add_stocks():
	"""
	Adds new stocks to the user's portfolio based on the ticker symbol and stock count provided in request arguments.
	
	1. Extracts the ticker symbol, count of stocks, and authorization token from the request.
	2. Creates an instance of StockController to manage the database operations.
	3. Opens the database connection.
	4. Attempts to add the specified stock for the user.
	5. If the stock already exists, returns an error JSON response with a 400 status code.
	6. Closes the database connection after the operation.
	7. Returns a success JSON response indicating stocks were added or an error if stock already exists.
	
	Returns:
		JSON response with a success message or an error if stocks already exist.

	HTTP Headers:
		Authorization: the token of the user.

	Params:
		ticker
		count
	"""
	ticker: str = request.args.get('ticker')
	count: str = request.args.get('count')
	token: str = request.headers.get('Authorization')

	stock_controller: StockController = StockController()

	response = make_response(jsonify({'message' : 'stocks added'}))

	try:
		stock_controller.add_stocks(ticker, count, token)
	except:
		response = jsonify({'error': 'stocks already exists, pls update them'}), 400

	return response


@stock.route('/update_stocks', methods=('GET', 'POST'))
def update_stocks():
	"""
	Updates the user's existing stock information based on the ticker symbol and new stock count provided in request arguments.
	
	1. Extracts the ticker symbol, updated stock count, and authorization token from the request.
	2. Creates an instance of StockController to manage database operations.
	3. Opens the database connection.
	4. Attempts to update the stock information for the user.
	5. If the update fails, returns an error JSON response with a 400 status code.
	6. Closes the database connection after the operation.
	7. Returns a success JSON response indicating stocks were updated or an error if update failed.
	
	Returns:
		JSON response with a success message or an error if the update failed.

	HTTP Headers:
		Authorization: the token of the user.

	Params:
		ticker
		count
	"""
	ticker: str = request.args.get('ticker')
	count: str = request.args.get('count')
	token: str = request.headers.get('Authorization')

	stock_controller: StockController = StockController()

	response = make_response(jsonify({'message' : 'stocks updated'}))

	try:
		stock_controller.update_stocks(ticker, count, token)
	except:
		response = jsonify({'error': 'could not update stocks'}), 400

	return response