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

function computeFunctions(data, windowSize) {

    const dataSmooth = lowpass(data, windowSize);
    const derivative = timeDerivative(dataSmooth);
    const secondDerivative = timeDerivative(derivative);

    return [dataSmooth, derivative, secondDerivative];
}

function baseAnalysisCharts(dates, closeData, volumeData, closeFunctions, volumeFunctions, sufix) {

    let closeDatasets = [];
    closeDatasets.push({
        label: "Close",
        data: closeData,
        borderWidth: 1
    });

    closeDatasets.push({
        label: "Close smooth",
        data: closeFunctions[0],
        borderWidth: 1
    });
    
    chart('Close' + sufix, dates, closeDatasets, "Close Analysis");

    // Volume chart
    let volumeDatasets = [];
    volumeDatasets.push({
        label: "Volume",
        data: volumeData,
        borderWidth: 1
    });

    volumeDatasets.push({
        label: "Volume smooth",
        data: volumeFunctions[0],
        borderWidth: 1
    });
    
    chart('Volume' + sufix, dates, volumeDatasets, "Volume Analysis");

    // Close Derivative (trend) chart
    let closeDerivativeDatasets = [];

    closeDerivativeDatasets.push({
        label: "Close (smooth) time derivative = trend",
        data: closeFunctions[1],
        borderWidth: 1
    });

    closeDerivativeDatasets.push({
        label: "Close (smooth) time second derivative",
        data: closeFunctions[2],
        borderWidth: 1
    });
    
    chart('DerivativeClose' + sufix, dates, closeDerivativeDatasets);

    // Volume Derivative chart
    let volumeDerivativeDatasets = [];

    volumeDerivativeDatasets.push({
        label: "Volume (smooth) time derivative",
        data: volumeFunctions[1],
        borderWidth: 1
    });

    volumeDerivativeDatasets.push({
        label: "Volume (smooth) time second derivative",
        data: volumeFunctions[2],
        borderWidth: 1
    });
    
    chart('DerivativeVolume' + sufix, dates, volumeDerivativeDatasets);
}

function shortTerm(dates, closeData, volumeData, closeFunctions, volumeFunctions) {

    const lastDays = 30;

    const lastDates = dates.slice(-lastDays);
    const lastCloseData = closeData.slice(-lastDays);
    const lastVolumeData = volumeData.slice(-lastDays);

    for(let i = 0; i < closeFunctions.length; i ++) {
        closeFunctions[i] = closeFunctions[i].slice(-lastDays);
        volumeFunctions[i] = volumeFunctions[i].slice(-lastDays);
    }

    baseAnalysisCharts(lastDates, lastCloseData, lastVolumeData, closeFunctions, volumeFunctions, "ST");

    // Decision tree
    const closeTimeDerivative = closeFunctions[1];
    const volumeTimeDerivative = volumeFunctions[1];

    const decision = solveDecisionTree(
        closeTimeDerivative[closeTimeDerivative.length - 1], 
        volumeTimeDerivative[volumeTimeDerivative.length - 1]
    );

    document.getElementById(`decision${decision}`).classList.add('table-primary');
}

function mediumTerm(dates, closeData, volumeData, closeFunctions, volumeFunctions) {

    const lastDays = 120;

    const lastDates = dates.slice(-lastDays);
    const lastCloseData = closeData.slice(-lastDays);
    const lastVolumeData = volumeData.slice(-lastDays);

    for(let i = 0; i < closeFunctions.length; i ++) {
        closeFunctions[i] = closeFunctions[i].slice(-lastDays);
        volumeFunctions[i] = volumeFunctions[i].slice(-lastDays);
    }

    baseAnalysisCharts(lastDates, lastCloseData, lastVolumeData, closeFunctions, volumeFunctions, "MT");

    // Deep Learning approach
}

function longTerm(dates, closeData, volumeData, closeFunctions, volumeFunctions) {

    baseAnalysisCharts(dates, closeData, volumeData, closeFunctions, volumeFunctions, "LT");

    // Linear regression
    const n = dates.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = closeFunctions[0];

    //y = mx + b
    const line = linearRegression(x, y);
    const lineData = [line[1], (n - 1) * line[0] + line[1]];
    const lineDates = [dates[0], dates[n - 1]];

    let pPrediction = document.getElementById("LT-prediction");
    if(line[0] > 0) {
        pPrediction.innerHTML = `<div>y = ${line[0]}x + ${line[1]}</div><div><p>As m > 0 <strong class="text-success">Consider buying</strong></p></div>`;
    }else if (line[0] < 0) {
        pPrediction.innerHTML = `<div>y = ${line[0]}x + ${line[1]}</div><div><p>As m < 0 <strong class="text-danger">Consider selling</strong></p></div>`;
    }else {
        pPrediction.innerHTML = `<div>y = ${line[0]}x + ${line[1]}</div><div><p>As m = 0 <strong class="text-warning">Hold</strong></p></div>`;
    }

    // Plot
    let lineDatasets = [];

    lineDatasets.push({
        label: "Linear regression (trend)",
        data: lineData,
        borderWidth: 2
    });
    
    chart('LinearRegressionLT', lineDates, lineDatasets, "");
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

    let ticker = selectedTickers[0];
    let html = `<tr><td><strong>${ticker}</strong></td>`;
    
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
    tbody.innerHTML = html;

    // Analysis charts
    let analysisData = getCloseVolume(data, selectedTickers[0]);

    let dates = analysisData[0];
    let closeData = analysisData[1];
    let volumeData = analysisData[2];

    let windowSizeST = 5;
    const closeFunctionsST = computeFunctions(closeData, windowSizeST);
    const volumeFunctionsST = computeFunctions(volumeData, windowSizeST); // Volume small window size always

    let windowSizeMT = 10;
    const closeFunctionsMT = computeFunctions(closeData, windowSizeMT);
    const volumeFunctionsMT = computeFunctions(volumeData, windowSizeST); // Volume small window size always

    let windowSizeLT = 50;
    const closeFunctionsLT = computeFunctions(closeData, windowSizeLT);
    const volumeFunctionsLT = computeFunctions(volumeData, windowSizeST); // Volume small window size always

    // Long term
    longTerm(dates, closeData, volumeData, closeFunctionsLT, volumeFunctionsLT, "LT");

    // Medium term
    mediumTerm(dates, closeData, volumeData, closeFunctionsMT, volumeFunctionsMT, "MT");

    // Short term
    shortTerm(dates, closeData, volumeData, closeFunctionsST, volumeFunctionsST, "ST");
}