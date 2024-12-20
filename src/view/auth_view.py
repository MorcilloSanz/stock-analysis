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
    username = request.form.get('username')
    password = request.form.get('password')

    auth_controller: AuthController = AuthController()

    user = auth_controller.verify_user(username, password)

    if len(user) == 0:
        return 'Bad login', 401
    
    response = {}
    
    if user[0][1] == username and str(user[0][3]) == str(AuthController.sha256(password)):

        token = auth_controller.get_token(int(user[0][0]))

        response['user'] = {
            'id' : user[0][0],
            'username' : username,
            'email' : user[0][2],
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
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')

    auth_controller: AuthController = AuthController()

    response = jsonify({'message': f'{username} registered successfully'}), 200

    try:
        auth_controller.register_user(username, email, password)
    except:
        response  = jsonify({'error': 'The user already exists'}), 400

    return response