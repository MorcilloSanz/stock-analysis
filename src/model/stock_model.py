from datetime import datetime

import yfinance as yf
import pandas as pd

from model.database_model import DatabaseModel


class StockModel(DatabaseModel):


	def __init__(self) -> None:
		super().__init__()


	def companies_data(self, tickers: list[str], start_date: datetime, end_date: datetime) -> pd.DataFrame:
		companies_data = yf.download(tickers, start=start_date, end=end_date, group_by='ticker')

		companies_data.index = pd.to_datetime(companies_data.index)
		companies_data.index = companies_data.index.strftime('%Y-%m-%d')

		return companies_data
	