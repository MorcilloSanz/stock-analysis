from datetime import datetime

import yfinance as yf
import pandas as pd

from model.auth_model import AuthModel


class StockModel(AuthModel):


	def __init__(self) -> None:
		super().__init__()


	def companies_data(self, tickers: list[str], start_date: datetime, end_date: datetime) -> pd.DataFrame:
		companies_data = yf.download(tickers, start=start_date, end=end_date, group_by='ticker')

		companies_data.index = pd.to_datetime(companies_data.index)
		companies_data.index = companies_data.index.strftime('%Y-%m-%d')

		return companies_data
	

	def add_stocks(self, ticker: str, count: float, token: str) -> None:
		"""
		"""
		user_id: int = self.get_user_id(token)

		sql: str = f"INSERT INTO STOCKS(USER_ID, TICKER, COUNT) VALUES('{user_id}','{ticker}','{count}');"
		self.database.cur.execute(sql)

		self.database.con.commit()


	def get_stocks(self, token: str) -> any:
		"""
		"""
		sql: str = f"SELECT * FROM STOCKS WHERE USER_ID = (SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}');"
		self.database.cur.execute(sql)

		return self.database.cur.fetchall()
	

	def update_stocks(self, ticker:str, count: float, token: str) -> None:
		"""
		"""
		sql: str = f"UPDATE STOCKS SET COUNT='{count}' WHERE TICKER = '{ticker}' AND USER_ID = (SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}');"
		self.database.cur.execute(sql)

		self.database.con.commit()