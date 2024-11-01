import sqlite3
import threading
from pathlib import Path


SQL: str = 'tables.sql'
DATABASE: str = 'database.db'


class DataBase:
	"""
	DataBase class allows you to interact directly with the database.
	"""

	__instance = None


	def __init__(self) -> None:
		self.con = None
		self.cur = None
		self.open: bool = False
		self.lock = threading.Lock()
	

	@staticmethod
	def get_instance() -> any:
		"""
		Singleton pattern. Returns the instance.

		Returns:
			The instance.
		"""
		if DataBase.__instance == None:
			DataBase.__instance = DataBase()

		return DataBase.__instance


	def open_connection(self) -> None:
		"""
		Opens a new connection.
		"""
		with self.lock:

			script_dir: Path = Path(__file__).resolve().parent
			file_path: Path = script_dir / DATABASE

			self.con = sqlite3.connect(file_path)
			self.cur = self.con.cursor()

			self.open = True


	def close_connection(self) -> None:
		"""
		Closes the current connection.
		"""
		with self.lock:
			self.con.close()
			self.open = False


	def __get_sql(self) -> str:
		"""
		Reads tables.sql and returns the sql code.

		Returns:
			The sql code.
		"""
		sql: str = ""

		script_dir: Path = Path(__file__).resolve().parent
		file_path: Path = script_dir / SQL
		file = open(file_path, "r", encoding="utf-8")

		sql = ''.join(file.readlines())
		file.close()

		return sql
	

	def create_database(self) -> None:
		"""
		Creates a database if not exists.
		"""
		sql = self.__get_sql()
		self.cur.executescript(sql)


	def exists(self) -> bool:
		"""
		Checks wether the database exists or not.

		Returns:
			If exists or not.
		"""
		script_dir: Path = Path(__file__).resolve().parent
		file_path: Path = script_dir / DATABASE
		file = Path(file_path)
		return file.is_file()