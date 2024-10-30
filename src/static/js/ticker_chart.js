const vars = ["Open", "High", "Low", "Close", "Adj Close", "Volume"];

/**
 * Generates a line chart using Chart.js for a specific dataset.
 * 
 * @param {number} j - The index to identify the chart (used for element ID and chart title).
 * @param {Array} dates - An array of dates representing the x-axis labels for the chart.
 * @param {Array} tickerDatasets - An array of dataset objects, where each dataset contains data points and a label for a specific ticker.
 */
function chart(j, dates, tickerDatasets) {

    new Chart(document.getElementById('chart' + j).getContext('2d'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: tickerDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            radius: 0,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: vars[j]
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day' // Mostrar por dia
                    }
                },
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

/**
 * Processes and organizes data to generate multiple charts for selected tickers.
 * 
 * @param {Object} data - The complete data object containing price values for each ticker and variable combination.
 * @param {Array} selectedTickers - An array of ticker symbols selected by the user to display on the charts.
 */
function generateChart(data, selectedTickers) {

    dates = [];
    for(let j = 0; j < vars.length; j ++) {

        prices = [];
        for(let i = 0; i < selectedTickers.length; i ++) {

            let ticker = selectedTickers[i];
            let pair = "('" + ticker + "', '" + vars[j] + "')";

            price = [];
            for(const key in data[pair]) {
                if(j == 0) dates.push(key);
                price.push(data[pair][key]);
            }

            prices.push(price);
        }

        tickerDatasets = [];
        for(let i = 0; i < selectedTickers.length; i ++) {
            tickerDatasets.push({
                label: selectedTickers[i],
                data: prices[i],
                borderWidth: 1
            });
        }

        chart(j, dates, tickerDatasets);
    }
}

/**
 * Loads a table of stock entries and dynamically generates rows with ticker data.
 * 
 * @param {Object} data - The data object containing stock information for each ticker and variable.
 *                        It is structured with pairs of ticker and variable names as keys, mapping to
 *                        arrays of entries.
 * @param {Array} selectedTickers - Array of ticker symbols selected for display in the table.
 */
function loadEntries(data, selectedTickers) {

    // Load table
	let tbody = document.getElementById("stock-entries");
	let html = "";

	for(let i = 0; i < selectedTickers.length; i ++) {

        let button = `<button id='button-${selectedTickers[i]}' type='button' class='btn btn-link'>${selectedTickers[i]}</button>`;
        html += `<tr><th scope='row'>${i + 1}</th><td>${button}</td>`;

		let ticker = selectedTickers[i];
        for(let j = 0; j < vars.length; j ++) {

            let pair = "('" + ticker + "', '" + vars[j] + "')";

            let lastEntry = null;
            for(const key in data[pair])
                lastEntry = data[pair][key];

            html += `<td>${lastEntry}</td>`
        }

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        html += `<td>${formattedDate}</td><tr>`;
	}

    tbody.innerHTML = html;

    // Buttons events
    for(let i = 0; i < selectedTickers.length; i ++) {
        let id = `button-${selectedTickers[i]}`;

        document.getElementById(id).addEventListener('click', function() {
            alert(id);

            // http request to linear regression of Close, plot and compute derivative -> tendency.
            // Insert candlestick chart with close and tendency datasets.
            // Compute close and volume derivatives with respect to time.
        });
    }
}