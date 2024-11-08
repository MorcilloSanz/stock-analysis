from model.database_model import DatabaseModel


class DatabaseController:
	"""
	DatabaseController class. Communicates with the DatabaseModel
	"""


	def __init__(self) -> None:
		self.model = DatabaseModel()

	
	def open_connection(self):
		"""
		Opens a new connection.
		"""
		return self.model.open_connection()


	def close_connection(self):
		"""
		Closes the current connection.
		"""
		self.model.close_connection()