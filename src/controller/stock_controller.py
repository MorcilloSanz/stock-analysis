from datetime import datetime, timedelta

from database.database import *

from model.stock_model import StockModel
from controller.database_controller import DatabaseController

import pandas as pd


class StockController(DatabaseController):
	"""
	StockController class
	"""


	def __init__(self):
		super().__init__()
		self.model = StockModel()
	

	def companies_data(self, tickers: str, days: int) -> pd.DataFrame:
		"""
		Fetches historical stock data for a list of companies within a specified date range since today.
		
		1. Uses the yfinance library to download historical data for the specified tickers between the given start and end dates.
		2. Groups the downloaded data by ticker symbol.
		3. Formats the index of the data (dates) to 'YYYY-MM-DD'.
		
		Args:
			tickers (list[str]): A list of company ticker symbols to retrieve data for.
			days: The days since today we want to retrieve the data.
		
		Returns:
			pd.DataFrame: A DataFrame containing historical stock data for the specified companies, grouped by ticker.
		"""
		companies_tickers: list[str] = tickers.split(",")

		end_date: datetime = datetime.today().strftime('%Y-%m-%d')
		start_date: datetime = (datetime.today() - timedelta(days=days)).strftime('%Y-%m-%d')

		return self.model.companies_data(companies_tickers, start_date, end_date)


	def add_stocks(self, ticker: str, count: float, token: str) -> None:
		"""
		Adds a specified number of stocks for a user identified by the token.
		
		1. Retrieves the user ID associated with the provided token.
		2. Inserts a new record into the STOCKS table with the user ID, ticker symbol, and stock count.
		3. Commits the transaction to the database.
		
		Args:
			ticker (str): The ticker symbol of the stock to add.
			count (float): The number of shares to add for the specified stock.
			token (str): The authorization token to identify the user.
		"""
		self.model.add_stocks(ticker, count, token)


	def get_stocks(self, token: str) -> any:
		"""
		Retrieves all stock data for a user identified by the token.
		
		1. Constructs a SQL query to select all stock records for the user.
		2. Executes the query and fetches all results.
		
		Args:
			token (str): The authorization token to identify the user.
		
		Returns:
			any: The result set containing the user's stock data from the database.
		"""
		return self.model.get_stocks(token)
	

	def update_stocks(self, ticker:str, count: float, token: str) -> None:
		"""
		Updates the stock count for a specific ticker belonging to the user identified by the token.
		
		1. Constructs a SQL query to update the stock count for the specified ticker and user.
		2. Executes the update and commits the transaction.
		
		Args:
			ticker (str): The ticker symbol of the stock to update.
			count (float): The new stock count to set for the specified stock.
			token (str): The authorization token to identify the user.
		"""
		self.model.update_stocks(ticker, count, token)


	def delete_stocks(self, ticker: str, token: str) -> None:
		"""
		Deletes the stocks of a specific ticker belonging to the user identified by the token.

		1. Constructs a SQL query.
		2. Executes the delete and commits the transaction.

		Args:
			ticker (str): The ticker symbol of the stock to update.
			token (str): The authorization token to identify the user.
		"""
		self.model.delete_stocks(ticker, token)