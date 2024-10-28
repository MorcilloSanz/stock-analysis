from datetime import datetime, timedelta

import pandas as pd
import yfinance as yf
from flask import Blueprint, request, jsonify, make_response


# Create a blueprint for the stock module
stock = Blueprint('stock', __name__, url_prefix='/stock')


def CORS(response):
	"""
    Adds Cross-Origin Resource Sharing (CORS) headers to the given response, allowing access 
    from different origins.
    
    Parameters:
        response (Response): The HTTP response object to which CORS headers will be added.

    Modifies:
        response.headers: Adds headers to allow any origin, GET, POST, OPTIONS methods, 
                          and specific request headers (Content-Type, Authorization).
    """
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
	response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'


@stock.route('/tickers', methods=['OPTIONS'])
def tickers_options():
	"""
	Handles OPTIONS requests for CORS preflight. Returns a response with CORS headers.

	Returns:
		Response: An empty HTTP response with CORS headers.
	"""
	response = make_response()
	CORS(response)
	return response


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
	CORS(response)

	return response


@stock.route('/data', methods=['OPTIONS'])
def stock_options():
	"""
	Handles OPTIONS requests for CORS preflight. Returns a response with CORS headers.

	Returns:
		Response: An empty HTTP response with CORS headers.
	"""
	response = make_response()
	CORS(response)
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

	Params:
		?tickers=AAPL,MSFT,GOOGL
    """
	companies_tickers: str = request.args.get('tickers').split(',')

	# Date range
	end_date: datetime = datetime.today().strftime('%Y-%m-%d')
	start_date: datetime = (datetime.today() - timedelta(days=365)).strftime('%Y-%m-%d')

	# Download companies data 
	companies_data = yf.download(companies_tickers, start=start_date, end=end_date, group_by='ticker')

	# Return response
	response = make_response(companies_data.to_json())
	CORS(response)

	return response	