/**
 * Logs in a user by sending a POST request with username and password.
 * 
 * @async
 * @function login
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} The result of the login operation, parsed as JSON.
 * @throws Will throw an error if the network response is not ok or if the login credentials are incorrect.
 */
async function login(username, password) {

	const formdata = new FormData();
	formdata.append("username", username);
	formdata.append("password", password);

	const requestOptions = {
		method: "POST",
		body: formdata,
		redirect: "follow"
	};

	const response = await fetch(`${URL_BASE}${END_POINT_LOGIN}`, requestOptions);
	if (!response.ok) {
		throw new Error("Network response was not ok " + response.statusText);
	}

	if(response.status === 401) {
		throw new Error("Bad login");
	}

	const result = await response.json();
	return result;
}

/**
 * Registers a new user by sending a POST request with username, email, and password.
 * 
 * @async
 * @function register
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<Object>} The result of the registration operation, parsed as JSON.
 * @throws Will throw an error if the network response is not ok, if the user already exists, or if the authorization is unsuccessful.
 */
async function register(username, email, password) {

	const formdata = new FormData();
	formdata.append("username", username);
	formdata.append("email", email);
	formdata.append("password", password);

	const requestOptions = {
		method: "POST",
		body: formdata,
		redirect: "follow"
	};

	const response = await fetch(`${URL_BASE}${END_POINT_REGISTER}`, requestOptions);
	if (!response.ok) {
		throw new Error("Network response was not ok " + response.statusText);
	}

	if(response.status == 400) {
		throw new Error("User already exists");
	}else if(response.status == 401) {
		throw new Error("Unauthorized");
	}

	const result = await response.json();
	return result;
}