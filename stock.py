from datetime import datetime, timedelta

import yfinance as yf
from flask import Blueprint, request, jsonify, make_response


stock = Blueprint('stock', __name__, url_prefix='/stock')


def CORS(response):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
	response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'


@stock.route('/', methods=['OPTIONS'])
def stock_options():
    response = make_response()
    CORS(response)
    return response


@stock.route('/', methods=('GET', 'POST'))
def home():

	# Companies tickers
	companies_tickers: list[str] = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

	# Date range
	end_date: datetime = datetime.today().strftime('%Y-%m-%d')
	start_date: datetime = (datetime.today() - timedelta(days=365)).strftime('%Y-%m-%d')

	# Download companies data 
	companies_data = yf.download(companies_tickers, start=start_date, end=end_date, group_by='ticker')

	# Return response
	response = make_response(companies_data.to_json())
	CORS(response)

	return response	