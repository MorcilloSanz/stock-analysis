const URL = "http://localhost:5000/";
const END_POINT = "stock/";


function transformData(data) {

	const chartData = {};

	for (let key in data) {
		const [symbol, priceType] = key.match(/'(\w+)'/g).map(k => k.replace(/'/g, ""));
		
		if (!chartData[symbol]) chartData[symbol] = {};
		if (!chartData[symbol][priceType]) chartData[symbol][priceType] = { labels: [], data: [] };
		
		for (let timestamp in data[key]) {
			const date = new Date(parseInt(timestamp));
			chartData[symbol][priceType].labels.push(date.toISOString().split('T')[0]);
			chartData[symbol][priceType].data.push(data[key][timestamp]);
		}
	}

	return chartData;
}

function createChart(data) {

	console.log(data)
	let chartData = transformData(data);
	console.log(chartData)
	
	new Chart(ctx, {
		type: 'line',
		data: chartData,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				}
			}
		}
	});
}

async function loadChart(ctx) {

	fetch(URL + END_POINT, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
	})
	.then(response => response.json())
	.then(data => createChart(data))
	.catch(error => console.error('Error:', error));
}