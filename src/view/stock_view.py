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

	# Get companies data
	stock_controller: StockController = StockController()
	companies_data: pd.DataFrame = stock_controller.companies_data(companies_tickers, days=365)

	# Return response
	response = make_response(companies_data.to_json())
	return response	