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