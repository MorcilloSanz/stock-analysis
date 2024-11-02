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
async function getData(tickers) {

	const requestOptions = {
		method: "GET",
		redirect: "follow"
	};

	const params = new URLSearchParams({ tickers: tickers.join(",") });

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