const vars = ["Open", "High", "Low", "Close", "Adj Close", "Volume"];

/**
 * Generates a line chart using Chart.js for a specific dataset.
 * 
 * @param {number} j - The index to identify the chart (used for element ID and chart title).
 * @param {Array} dates - An array of dates representing the x-axis labels for the chart.
 * @param {Array} _datasets - An array of dataset objects, where each dataset contains data points and a label for a specific ticker.
 */
function chart(j, dates, _datasets, titleText="") {

    new Chart(document.getElementById('chart' + j).getContext('2d'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: _datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            radius: 0,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: titleText.length == 0 ? vars[j] : titleText
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
                    beginAtZero: false,
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

    let dates = [];
    for(let j = 0; j < vars.length; j ++) {

        let prices = [];
        for(let i = 0; i < selectedTickers.length; i ++) {

            let ticker = selectedTickers[i];
            let pair = `('${ticker}', '${vars[j]}')`;

            let price = [];
            for(const key in data[pair]) {
                if(j == 0) dates.push(key);
                price.push(data[pair][key]);
            }

            prices.push(price);
        }

        let tickerDatasets = [];
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

function getCloseVolume(data, ticker) {

    let pairClose = `('${ticker}', 'Close')`;
    let pairVolume = `('${ticker}', 'Volume')`;

    let dates = [];
    let closeData = [];
    let volumeData = [];

    for(const key in data[pairClose]) {
        dates.push(key);
        closeData.push(data[pairClose][key]);
    }

    for(const key in data[pairVolume]) {
        volumeData.push(data[pairVolume][key]);
    }

    return [dates, closeData, volumeData];
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

            document.getElementById('close-volume-analysis-container').style.visibility = 'visible';
            document.getElementById('decision-container').style.visibility = 'visible';

            let analysisData = getCloseVolume(data, selectedTickers[i]);

            let dates = analysisData[0];
            let closeData = analysisData[1];
            let volumeData = analysisData[2];

            let windowSize = 10;
            let closeDataSmooth = lowpass(closeData, windowSize);
            let volumeDataSmooth = lowpass(volumeData, windowSize);

            let closeTimeDerivative = timeDerivative(closeDataSmooth);
            let volumeTimeDerivative = timeDerivative(volumeDataSmooth);

            // Close chart
            let closeDatasets = [];
            closeDatasets.push({
                label: "Close",
                data: closeData,
                borderWidth: 1
            });
            closeDatasets.push({
                label: "Close smooth",
                data: closeDataSmooth,
                borderWidth: 1
            });
            
            chart('Close', dates, closeDatasets, "Close Analysis");

            // Volume chart
            let volumeDatasets = [];
            volumeDatasets.push({
                label: "Volume",
                data: volumeData,
                borderWidth: 1
            });
            volumeDatasets.push({
                label: "Volume smooth",
                data: volumeDataSmooth,
                borderWidth: 1
            });
            
            chart('Volume', dates, volumeDatasets, "Volume Analysis");

            // Close Derivative (trend) chart
            let closeDerivativeDatasets = [];
            closeDerivativeDatasets.push({
                label: "Close (smooth) time derivative = trend",
                data: closeTimeDerivative,
                borderWidth: 1
            });
            
            chart('DerivativeClose', dates, closeDerivativeDatasets);

            // Volume Derivative chart
            let volumeDerivativeDatasets = [];
            volumeDerivativeDatasets.push({
                label: "Volume (smooth) time derivative",
                data: volumeTimeDerivative,
                borderWidth: 1
            });
            
            chart('DerivativeVolume', dates, volumeDerivativeDatasets);

            // Decision tree
            let decision = solveDecisionTree(
                closeTimeDerivative[closeTimeDerivative.length - 1], 
                volumeTimeDerivative[volumeTimeDerivative.length - 1]
            );

            document.getElementById(`decision${decision}`).classList.add('table-primary');
        });
    }
}