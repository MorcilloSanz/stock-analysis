from flask import g

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
		db = g.db
		cursor = db.cursor()

		# Insert the user into the USER table
		sql = f"INSERT INTO USER(USERNAME, EMAIL, _HASH) VALUES('{username}','{email}','{hash_code}');"
		cursor.execute(sql)

		# Get the user ID by email
		sql = f"SELECT ID FROM USER WHERE EMAIL='{email}';"
		cursor.execute(sql)
		user_id = cursor.fetchall()[0][0]

		# Insert the token for the user into the TOKEN table
		sql = f"INSERT INTO TOKEN(USER_ID, TOKEN) VALUES('{user_id}','{token}');"
		cursor.execute(sql)

		db.commit()
		cursor.close()


	def verify_user(self, username: str, hash_code: str) -> list[any]:
		"""
		Check if there is any user with that username and password.

		Args:
			username: the username of the user.
			hash_code: the hash code of the user.

		Returns:
			The user (if it is empty, it means that there is no user with those credentials).
		"""
		db = g.db
		cursor = db.cursor()

		sql = f"SELECT * FROM USER WHERE USERNAME='{username}' AND _HASH='{hash_code}';"
		cursor.execute(sql)

		result = cursor.fetchall()
		cursor.close()

		return result


	def get_users(self) -> list[any]:
		"""
		Returns all the users registered in the database.

		Returns:
			The users.
		"""
		db = g.db
		cursor = db.cursor()

		sql = f"SELECT * FROM USER;"
		cursor.execute(sql)

		result = cursor.fetchall()
		cursor.close()

		return result


	def get_user_from_token(self, token: str) -> list[any]:
		"""
		Returns the user of a specified token.

		Args:
			token: the token of the user.

		Returns:
			The user.
		"""
		db = g.db
		cursor = db.cursor()

		sql = f"SELECT * FROM USER WHERE ID = (SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}');"
		cursor.execute(sql)

		result = cursor.fetchall()
		cursor.close()

		return result


	def get_token(self, user_id: int) -> str:
		"""
		Returns the token of a user.

		Args:
			user_id: the id of the user.

		Returns:
			The token.
		"""
		db = g.db
		cursor = db.cursor()

		sql = f"SELECT TOKEN.TOKEN FROM TOKEN WHERE USER_ID='{user_id}';"
		cursor.execute(sql)

		result = cursor.fetchall()
		cursor.close()

		return result[0][0] if result else None


	def get_user_id(self, token: str) -> any:
		"""
		Returns the user ID for a given token.

		Args:
			token: the token of the user.

		Returns:
			The user ID.
		"""
		db = g.db
		cursor = db.cursor()

		sql = f"SELECT USER_ID FROM TOKEN WHERE TOKEN='{token}';"
		cursor.execute(sql)
		result = cursor.fetchall()
		cursor.close()

		return result[0][0] if result else None
