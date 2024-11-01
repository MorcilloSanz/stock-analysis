from flask import Blueprint, request, jsonify

from controller.auth_controller import *


auth = Blueprint('auth', __name__, url_prefix='/auth')


@auth.route('/login', methods=('GET', 'POST'))
def login():
    """
    Returns the logged user if username and password are correct.

    HTTP args:
        username: the username of the user.
        password: the password of the user.

    Returns:
        The user or bad login.
    """
    username = request.args.get('username')
    password = request.args.get('password')

    auth_controller: AuthController = AuthController()

    auth_controller.open_connection()
    user = auth_controller.verify_user(username, password)
    auth_controller.close_connection()

    if len(user) == 0:
        return 'Bad login', 401
    
    response = {}
    
    if user[0][1] == username and str(user[0][4]) == str(AuthController.sha256(password)):

        auth_controller.open_connection()
        token = auth_controller.get_token(int(user[0][0]))
        auth_controller.close_connection()

        response['user'] = {
            'id' : user[0][0],
            'username' : username,
            'email' : user[0][2],
            'permission' : user[0][3],
            'token' : token
        }

        return jsonify(response), 200

    return 'Bad login', 401


@auth.route('/register', methods=('GET', 'POST'))
def register():
    """
    Registers a new user.

    HTTP args:
        username: the username of the user.
        email: the email of the user.
        password: the password of the user.

    Returns:
        Ok or error if the user already exists.
    """
    username = request.args.get('username')
    email = request.args.get('email')
    password = request.args.get('password')

    auth_controller: AuthController = AuthController()

    response = f'{username} registered successfully', 200

    auth_controller.open_connection()
    try:
        auth_controller.register_user(username, email, password)
    except:
        response  = 'The user already exists', 400
    auth_controller.close_connection()

    return response