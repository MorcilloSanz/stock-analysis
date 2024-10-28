const URL_BASE = "http://localhost:5000/";

const END_POINT_TICKERS = "stock/tickers";
const END_POINT_DATA = "stock/data";

async function getTickers() {

	const requestOptions = {
		method: "GET",
		redirect: "follow"
	};

	fetch(URL_BASE + END_POINT_TICKERS, requestOptions)
	.then((response) => {
		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}
		return response.json();
	})
	.then((result) => console.log(result))
	.catch((error) => console.error(error));

	return null;
}

async function getData(tickers) {

	const requestOptions = {
		method: "GET",
		redirect: "follow"
	};

	const params = new URLSearchParams({ tickers: tickers.join(",") });
	
	fetch(`${URL_BASE}${END_POINT_DATA}?${params}`, requestOptions)
	.then((response) => {
		if (!response.ok) {
			throw new Error("Network response was not ok " + response.statusText);
		}
		return response.json();
	})
	.then((result) => console.log(result))
	.catch((error) => console.error(error));

	return null;
}