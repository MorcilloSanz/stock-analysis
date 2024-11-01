import hashlib
import secrets

from database.database import *

from model.auth_model import AuthModel
from controller.database_controller import DatabaseController


SALT: str = 'saltysaltycode'


class AuthController(DatabaseController):
	"""
	AuthController class. Communicates the view with the DatabaseModel
	"""


	def __init__(self) -> None:
		super().__init__()
		self.model = AuthModel()


	@staticmethod
	def generate_token(length=32) -> str:
		"""
		Generates a random token.

		Args:
			length: the length of the token.

		Returns:
			The token.
		"""
		return secrets.token_hex(length)


	@staticmethod
	def sha256(password) -> str:
		"""
		Password enconding using sha256 hash algorithm.

		Args:
			password: the password we want to encrypt.

		Returns:
			The encrypted password.
		"""
		return hashlib.sha256(password.encode() + SALT.encode()).hexdigest()


	def register_user(self, username: str, email: str, password: str) -> None:
		"""
		Register a new user in the database.

		Args:
			username: the username of the user.
			email: the email of the user.
			password: the password of the user.
		"""
		hash_code = AuthController.sha256(password)
		token: str = AuthController.generate_token()

		self.model.register_user(username, email, hash_code, token)


	def verify_user(self, username: str, password: str) -> list[any]:
		"""
		Check if is there any user with that username and password.

		Args:
			username: the username of the user.
			password: the password of the user.

		Returns:
			The user (if it is empty, it means that there is no user with that credentials).
		"""
		hash_code = AuthController.sha256(password)
		return self.model.verify_user(username, hash_code)


	def get_users(self) -> list[any]:
		"""
		Returns all the users registered in the database.

		Returns:
			The users.
		"""
		return self.model.get_users()
	

	def get_user_from_token(self, token: str) -> list[any]:
		"""
		Returns the user of a specified token.

		Args:
			token: the token of the user.

		Returns:
			The user.
		"""
		return self.model.get_user_from_token(token)


	def get_token(self, user_id: int) -> str:
		"""
		Returns the token of a user.

		Args:
			user_id: the id of the user.

		Returns:
			The token.
		"""
		return self.model.get_token(user_id)