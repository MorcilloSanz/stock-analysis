from model.database_model import DatabaseModel


class AuthModel(DatabaseModel):
	"""
	AuthModel class. Deals with auth staff in the database.
	"""

	
	def __init__(self) -> None:
		super().__init__()


	def register_user(self, username: str, email: str, hash_code: str, token: str) -> None:
		"""
		Register a new user in the database.

		Args:
			username: the username of the user.
			email: the email of the user.
			hash_code: the hash code of the user.
			token: the token of the user.
		"""
		sql: str = f"INSERT INTO USER(USERNAME,EMAIL,_HASH) VALUES('{username}','{email}','{hash_code}');"
		self.database.cur.execute(sql)

		sql = f"SELECT ID FROM USER WHERE EMAIL='{email}';"
		self.database.cur.execute(sql)
		user_id: int = self.database.cur.fetchall()[0][0]

		sql = f"INSERT INTO TOKEN(USER_ID,TOKEN) VALUES('{user_id}','{token}');"
		self.database.cur.execute(sql)

		self.database.con.commit()


	def verify_user(self, username: str, hash_code: str) -> list[any]:
		"""
		Check if is there any user with that username and password.

		Args:
			username: the username of the user.
			hash_code: the hash code of the user.

		Returns:
			The user (if it is empty, it means that there is no user with that credentials).
		"""
		sql: str = f"SELECT * FROM USER WHERE USERNAME='{username}' AND _HASH='{hash_code}';"
		self.database.cur.execute(sql)

		return self.database.cur.fetchall()


	def get_users(self) -> list[any]:
		"""
		Returns all the users registered in the database.

		Returns:
			The users.
		"""
		sql: str = f"SELECT * FROM USER;"
		self.database.cur.execute(sql)

		return self.database.cur.fetchall()
	

	def get_user_from_token(self, token: str) -> list[any]:
		"""
		Returns the user of a specified token.

		Args:
			token: the token of the user.

		Returns:
			The user.
		"""
		sql: str = f"SELECT * FROM USER WHERE ID = (SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}');"
		self.database.cur.execute(sql)

		return self.database.cur.fetchall()


	def get_token(self, user_id: int) -> str:
		"""
		Returns the token of a user.

		Args:
			user_id: the id of the user.

		Returns:
			The token.
		"""
		sql: str = f"SELECT TOKEN.TOKEN FROM TOKEN WHERE USER_ID='{user_id}';"
		self.database.cur.execute(sql)

		return self.database.cur.fetchall()[0][0]