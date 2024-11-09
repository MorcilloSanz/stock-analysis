// Update name link
document.getElementById('name-link').text = user["username"];

function createLi(list, ticker, count) {

	const li = document.createElement("li");
	const div = document.createElement("div");

	li.className = "list-group-item";
	div.classList.add("container-fluid");
	div.innerHTML = `<h3>${ticker}</h3><p><strong>Count:</strong> ${count}</p>`;

	li.appendChild(div);
	list.appendChild(li);

	// Compute money
	getData([ticker], 2).then(data => {

		let pair = `('${ticker}', 'Close')`;

		let previousPrice = 0;
		let price = 0;

		let index = 0;
		for(let key in data[pair]) {

			price = data[pair][key];
			if(index == 0)
				previousPrice = price;

			index ++;
		}
		
		let money = price * count;
		let diff = price - previousPrice;

		let color = 'lightgreen';
		if(diff < 0) color = 'red';

		let arrow = "&#9650;";
		if(diff < 0) arrow = "&#9660;";

		div.innerHTML = `
		<div style="display: flex; justify-content: space-between; align-items: center;">
			<div>
				<h3 class="mb-3" style="display: inline; padding-bottom: 10px;">${ticker}</h3>
				<p class="mb-3" style="display: inline; margin-left: 3px; color: ${color}; font-weight: bold;">${arrow} ${Number(diff).toFixed(2)}</p>
				<p id="p-info-${ticker}" class="mb-3 text-body-secondary"><strong>Count:</strong> ${count} <strong>Money:</strong> ${Number(money).toFixed(2)}€</p>
			</div>
			<div id="buttonsContainer-${ticker}" style="display: flex; gap: 10px;"></div>
		</div>`;

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
			window.location.replace(analysisURL + '?ticker=' + ticker);
		});

		//div.appendChild(divButtons);
	}).catch(error => {
		console.error('Error fetching data:', error);
	});
}

// Load stocks
getStocks(user["token"]).then(stocks => {

	for(let i = 0; i < stocks.length; i ++) {

		let currentStock = stocks[i];
		let ticker = currentStock['TICKER'];
		let count = currentStock['COUNT'];

		// Create a new list item
		const list = document.getElementById("user-stocks");
		createLi(list, ticker, count);
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
	const inputText = document.getElementById('input-ticker').value;
	if(inputText.length > 0) {

		const ticker = inputText
		const count = 1;

		addStocks(ticker, count, user["token"]).then(response => {
			console.log(`${ticker} added successfully`);

			const list = document.getElementById("user-stocks");
			createLi(list, ticker, count);

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
				createLi(list, ticker, count);

			}).catch(error => {
				console.error('Error fetching tickers:', error);
			});
		});
	}
});