from datetime import datetime

import yfinance as yf
import pandas as pd
from flask import g

from model.auth_model import AuthModel


class StockModel(AuthModel):
	"""
	StockModel class
	"""


	def __init__(self) -> None:
		super().__init__()


	def companies_data(self, tickers: list[str], start_date: datetime, end_date: datetime) -> pd.DataFrame:
		"""
		Fetches historical stock data for a list of companies within a specified date range.

		1. Uses the yfinance library to download historical data for the specified tickers between the given start and end dates.
		2. Groups the downloaded data by ticker symbol.
		3. Formats the index of the data (dates) to 'YYYY-MM-DD'.

		Args:
			tickers (list[str]): A list of company ticker symbols to retrieve data for.
			start_date (datetime): The start date for the historical data.
			end_date (datetime): The end date for the historical data.

		Returns:
			pd.DataFrame: A DataFrame containing historical stock data for the specified companies, grouped by ticker.
		"""
		companies_data = yf.download(tickers, start=start_date, end=end_date, group_by='ticker')

		companies_data.index = pd.to_datetime(companies_data.index)
		companies_data.index = companies_data.index.strftime('%Y-%m-%d')

		return companies_data


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
		user_id: int = self.get_user_id(token)

		db = g.db
		cursor = db.cursor()

		sql = f"INSERT INTO STOCKS(USER_ID, TICKER, COUNT) VALUES('{user_id}','{ticker}','{count}');"
		cursor.execute(sql)

		db.commit()
		cursor.close()


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
		db = g.db
		cursor = db.cursor()

		sql = f"SELECT * FROM STOCKS WHERE USER_ID = (SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}');"
		cursor.execute(sql)

		result = cursor.fetchall()

		cursor.close()
		return result


	def update_stocks(self, ticker: str, count: float, token: str) -> None:
		"""
		Updates the stock count for a specific ticker belonging to the user identified by the token.

		1. Constructs a SQL query to update the stock count for the specified ticker and user.
		2. Executes the update and commits the transaction.

		Args:
			ticker (str): The ticker symbol of the stock to update.
			count (float): The new stock count to set for the specified stock.
			token (str): The authorization token to identify the user.
		"""
		db = g.db
		cursor = db.cursor()

		sql = f"UPDATE STOCKS SET COUNT='{count}' WHERE TICKER = '{ticker}' AND USER_ID = (SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}');"
		cursor.execute(sql)

		db.commit()
		cursor.close()
