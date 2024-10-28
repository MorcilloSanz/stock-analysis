import csv
import pandas as pd


if __name__ == "__main__":

	url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
	table = pd.read_html(url, header=0)
	df_sp500 = table[0]

	tickers = df_sp500['Symbol'].tolist()
	names = df_sp500['Security'].tolist()

	with open('tickers.csv', 'w', newline='') as file:
		writer = csv.writer(file)
		for ticker, name in zip(tickers, names):
			writer.writerow([ticker, name]) 