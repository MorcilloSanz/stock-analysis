from datetime import datetime, timedelta

import pandas as pd
import yfinance as yf
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
	companies_tickers: str = request.args.get('tickers').split(',')

	# Date range
	end_date: datetime = datetime.today().strftime('%Y-%m-%d')
	start_date: datetime = (datetime.today() - timedelta(days=365)).strftime('%Y-%m-%d')

	# Download companies data 
	companies_data = yf.download(companies_tickers, start=start_date, end=end_date, group_by='ticker')

	companies_data.index = pd.to_datetime(companies_data.index)
	companies_data.index = companies_data.index.strftime('%Y-%m-%d')

	# Return response
	response = make_response(companies_data.to_json())
	return response	