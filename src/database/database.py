import sqlite3
from threading import local
from pathlib import Path


SQL: str = 'tables.sql'
DATABASE: str = 'database.db'


class DataBase:
	"""
	DataBase class allows you to interact directly with the database.
	"""

	__instance = None
	_lock = local()


	def __init__(self) -> None:
		self.con = None
		self.cur = None
		self.open: bool = False
	

	def __new__(cls):
		if cls.__instance is None:
			cls.__instance = super().__new__(cls)
		return cls.__instance


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
		if not hasattr(self._lock, 'db'):

			script_dir: Path = Path(__file__).resolve().parent
			file_path: Path = script_dir / DATABASE

			self._lock.db = sqlite3.connect(file_path, check_same_thread=False)
			self._lock.db.row_factory = sqlite3.Row

		return self._lock.db


	def close_connection(self) -> None:
		"""
		Closes the current connection.
		"""
		db = getattr(self._lock, 'db', None)
		if db:
			db.close()
			del self._lock.db


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
		db = self.open_connection()
		db.cursor().executescript(sql)
		db.commit()


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