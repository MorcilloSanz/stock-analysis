from model.model import Model
from database.database import *


class DatabaseModel(Model):
	"""
	DatabaseModel class. Deals with the database
	"""


	def __init__(self) -> None:
		super().__init__()
		self.database: DataBase = DataBase.get_instance()

	
	def open_connection(self):
		"""
		Opens a new connection.
		"""
		return self.database.open_connection()


	def close_connection(self):
		"""
		Closes the current connection.
		"""
		self.database.close_connection()