async function login(username, password) {

	const requestOptions = {
		method: "POST",
		redirect: "follow"
	};

	const params = new URLSearchParams({ 
		username: username,
		password: password
	});


	const response = await fetch(`${URL_BASE}${END_POINT_LOGIN}?${params}`, requestOptions);
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

	const requestOptions = {
		method: "POST",
		redirect: "follow"
	};

	const params = new URLSearchParams({ 
		username: username,
		email: email,
		password: password
	});

	const response = await fetch(`${URL_BASE}${END_POINT_REGISTER}?${params}`, requestOptions);
	if (!response.ok) {
		throw new Error("Network response was not ok " + response.statusText);
	}

	if(response.status === 401 || response.status == 400) {
		throw new Error("User already exists");
	}

	const result = await response.json();
	return result;

}