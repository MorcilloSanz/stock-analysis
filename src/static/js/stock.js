/**
 * Fetches the tickers from the API.
 * 
 * @async
 * @function getTickers
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the tickers if the fetch is successful, or null if an error occurs.
 * 
 * @throws {Error} Throws an error if the network response is not ok.
 * 
 * @example
 * getTickers().then(tickers => {
 *     console.log(tickers);
 * }).catch(error => {
 *     console.error('Error fetching tickers:', error);
 * });
 */
async function getTickers() {

	const requestOptions = {
		method: "GET",
		redirect: "follow"
	};

	try {

		const response = await fetch(URL_BASE + END_POINT_TICKERS, requestOptions);
		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}

		const result = await response.json();
		return result;

	} catch (error) {
		return error;
	}
}

/**
 * Fetches data for the specified tickers from the API.
 * 
 * @async
 * @function getData
 * @param {Array<string>} tickers - An array of ticker symbols to fetch data for.
 * @returns {Promise<Object|null>} A promise that resolves to the data object for the tickers if the fetch is successful, or null if an error occurs.
 * 
 * @throws {Error} Throws an error if the network response is not ok.
 * 
 * @example
 * const selectedTickers = ["AAPL", "MSFT", "GOOGL"];
 * getData(selectedTickers).then(data => {
 *     console.log(data);
 * }).catch(error => {
 *     console.error('Error fetching data:', error);
 * });
 */
async function getData(tickers, days) {

	const requestOptions = {
		method: "GET",
		redirect: "follow"
	};

	const params = new URLSearchParams({ 
		tickers: tickers.join(","), 
		days: days 
	});

	try {

		const response = await fetch(`${URL_BASE}${END_POINT_DATA}?${params}`, requestOptions);
		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}

		const result = await response.json();
		return result;

	} catch (error) {
		return error;
	}
}

/**
 * Fetches the stock holdings of a user.
 * 
 * @param {string} token - A string containing the authorization token required to access the API.
 * @returns {Promise<Object|Error>} - Returns a JSON object with the user's stocks if successful, or an error object if the request fails.
 */
async function getStocks(token) {

	const myHeaders = new Headers();
	myHeaders.append("Authorization", token);

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
		redirect: "follow"
	};

	try {
		const response = await fetch(`${URL_BASE}${END_POINT_STOCKS}`, requestOptions);

		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}

		const result = await response.json();
		return result;
	}catch (error) {
		return error;
	}
}

/**
 * Adds a specified number of stocks to the user's holdings.
 * 
 * @param {string} ticker - The stock symbol (ticker) to add.
 * @param {number} count - The quantity of stocks to add.
 * @param {string} token - A string containing the authorization token required to access the API.
 * @returns {Promise<Object|Error>} - Returns a JSON object with the updated stock information if successful, or an error object if the request fails.
 */
async function addStocks(ticker, count, token) {

	const myHeaders = new Headers();
	myHeaders.append("Authorization", token);

	const params = new URLSearchParams({ 
		ticker: ticker,
		count: count
	});

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow"
	};

	try {
		const response = await fetch(`${URL_BASE}${END_POINT_ADD_STOCKS}?${params}`, requestOptions);

		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}

		const result = await response.json();
		return result;
	}catch (error) {
		return error;
	}
}

async function updateStocks(ticker, count, token) {

	const myHeaders = new Headers();
	myHeaders.append("Authorization", token);

	const params = new URLSearchParams({ 
		ticker: ticker,
		count: count
	});

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow"
	};

	try {
		const response = await fetch(`${URL_BASE}${END_POINT_UPDATE_STOCKS}?${params}`, requestOptions);

		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}

		const result = await response.json();
		return result;
	}catch (error) {
		return error;
	}
}

async function deleteStocks(ticker, token) {

	const myHeaders = new Headers();
	myHeaders.append("Authorization", token);

	const params = new URLSearchParams({ 
		ticker: ticker
	});

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow"
	};

	try {
		const response = await fetch(`${URL_BASE}${END_POINT_DELETE_STOCKS}?${params}`, requestOptions);

		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}

		const result = await response.json();
		return result;
	}catch (error) {
		return error;
	}
}