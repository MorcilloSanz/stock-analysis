const vars = ["Open", "High", "Low", "Close", "Adj Close", "Volume"];

/**
 * Generates a line chart using Chart.js for a specific dataset.
 * 
 * @param {number} j - The index to identify the chart (used for element ID and chart title).
 * @param {Array} dates - An array of dates representing the x-axis labels for the chart.
 * @param {Array} tickerDatasets - An array of dataset objects, where each dataset contains data points and a label for a specific ticker.
 */
function chart(j, dates, tickerDatasets) {

    new Chart(document.getElementById('chart' + j), {
        type: 'line',
        data: {
            labels: dates,
            datasets: tickerDatasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: vars[j]
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