// Update name link
document.getElementById('name-link').text = user["username"];

function createLi(list, ticker, count, info) {

	const li = document.createElement("li");
	const div = document.createElement("div");

	li.className = "list-group-item";
	div.classList.add("container-fluid");
	div.innerHTML = `<h3>${ticker}</h3><p><strong>Count:</strong> ${count}</p>`;

	li.appendChild(div);
	list.appendChild(li);

	let price = info['currentPrice'];
	let previousPrice = info['previousClose'];
	let money = price * count;
	let diff = price - previousPrice;

	let color = 'lightgreen';
	if(diff < 0) color = 'red';

	let arrow = "&#9650;";
	if(diff < 0) arrow = "&#9660;";

	div.innerHTML = `
	<div class="card mb-3">
		<div class="card-header">
			<h3 class="mb-3" style="display: inline; padding-bottom: 10px;">${ticker}</h3>
			<p class="mb-3" style="display: inline; margin-left: 3px; color: ${color}; font-weight: bold;">${arrow} ${Number(diff).toFixed(2)}</p>
		</div>
		<div class="card-body">
			<h5 class="card-title">${info['longName']}, ${info['country']}</h5>
			<p class="card-text" style="margin-bottom: 0px; padding-bottom: 0px;">${info['sector']}, ${info['industry']}</p>
			<a class="btn btn-link" href="${info['website']}" style="margin: 0px; padding: 0px;">${info['website']}</a>
			<p id="p-info-${ticker}" class="mb-3 text-body-secondary"><strong>Currency:</strong> ${info['currency']} <strong>Price:</strong> ${price} <strong>Count:</strong> ${count} <strong>Money:</strong> ${Number(money).toFixed(2)}</p>
			<div id="buttonsContainer-${ticker}" style="display: flex; gap: 10px;"></div>
		</div>
	</div>
	`;

	// Buttons
	const divButtons = document.getElementById(`buttonsContainer-${ticker}`);

	const buttonDelete = document.createElement("button");
	buttonDelete.className = "btn btn-danger bi bi-trash";
	buttonDelete.textContent = "";
	divButtons.appendChild(buttonDelete);

	buttonDelete.addEventListener('click', function() {
		
		deleteStocks(ticker, user["token"]).then(response => {

			console.log(`${ticker} deleted successfully`);
			list.removeChild(li);

		}).catch(error => {
			console.error('Error fetching tickers:', error);
		});
	});

	const buttonModify = document.createElement("button");
	buttonModify.className = "btn btn-secondary bi bi-gear";
	
	buttonModify.textContent = "";
	divButtons.appendChild(buttonModify);

	buttonModify.addEventListener('click', function() {

		let count = prompt('Count');
		if(count == null) 
			return;
		
		updateStocks(ticker, count, user["token"]).then(response => {

			console.log(`${ticker} updated successfully`);

			let money = price * Number(count);
			document.getElementById(`p-info-${ticker}`).innerHTML = `<strong>Count:</strong> ${count} <strong>Money:</strong> ${Number(money).toFixed(2)}€`;

		}).catch(error => {
			console.error('Error fetching tickers:', error);
		});
	});

	const buttonAnalyze = document.createElement("button");
	buttonAnalyze.className = "btn btn-primary bi bi-bar-chart";
	buttonAnalyze.textContent = "";
	divButtons.appendChild(buttonAnalyze);

	buttonAnalyze.addEventListener('click', function() {
		//window.location.replace(analysisURL + '?ticker=' + ticker);
		window.open(analysisURL + '?ticker=' + ticker, "_blank");
	});
}

// Load stocks
getStocks(user["token"]).then(stocks => {

	for(let i = 0; i < stocks.length; i ++) {

		let currentStock = stocks[i];
		let ticker = currentStock['TICKER'];
		let count = currentStock['COUNT'];

		let list = document.getElementById("user-stocks");

		getTickerInfo(ticker).then(info => {
			createLi(list, ticker, count, info);
		}).catch(error => {
			console.error('Error fecthing ticker:', error);
		});
	}
}).catch(error => {
	console.error('Error fetching tickers:', error);
});

// Get tickers request
getTickers().then(tickers => {
	const select = document.getElementById('tickers');

	for (const key in tickers.Ticker) {

		const ticker = tickers.Ticker[key];
		const name = tickers.Name[key];

		const option = document.createElement('option');
		option.value = ticker;
		option.textContent = name + ' (' + ticker + ')';

		select.appendChild(option);
	}
}).catch(error => {
	console.error('Error fetching tickers:', error);
});

// Add tickers
document.getElementById('add-btn').addEventListener('click', function() {

	const tickersSelect = document.getElementById('tickers');

	// Manual
	let inputText = document.getElementById('input-ticker').value;
	if(inputText.length > 0) {

		const ticker = inputText
		const count = 1;

		addStocks(ticker, count, user["token"]).then(response => {
			console.log(`${ticker} added successfully`);

			const list = document.getElementById("user-stocks");
			getTickerInfo(ticker).then(info => {
				createLi(list, ticker, count, info);
			}).catch(error => {
				console.error("Could not get ticker info", error);
			});

			inputText = document.getElementById('input-ticker').value = "";

		}).catch(error => {
			console.error('Error fetching tickers:', error);
		});
	}
	// From select
	else {
		Array.from(tickersSelect.selectedOptions).forEach(option => {

			const ticker = option.value;
			const count = 1;

			addStocks(ticker, count, user["token"]).then(response => {
				console.log(`${ticker} added successfully`);

				const list = document.getElementById("user-stocks");
				getTickerInfo(ticker).then(info => {
					createLi(list, ticker, count, info);
				}).catch(error => {
					console.error("Could not get ticker info", error);
				});

			}).catch(error => {
				console.error('Error fetching tickers:', error);
			});
		});
	}
});