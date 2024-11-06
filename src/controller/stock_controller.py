from datetime import datetime, timedelta

from database.database import *

from model.stock_model import StockModel
from controller.database_controller import DatabaseController

import pandas as pd


class StockController(DatabaseController):


	def __init__(self):
		super().__init__()
		self.model = StockModel()
	

	def companies_data(self, tickers: str, days: int) -> pd.DataFrame:
		companies_tickers: list[str] = tickers.split(",")

		end_date: datetime = datetime.today().strftime('%Y-%m-%d')
		start_date: datetime = (datetime.today() - timedelta(days=days)).strftime('%Y-%m-%d')

		return self.model.companies_data(companies_tickers, start_date, end_date)
