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
                    display: true
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

function timeDerivative(fun) {

    let derivative = [];

    for(let i = 0; i < fun.length; i ++) {

        if(i == 0) {
            // Forward difference
            let diff = fun[1] - fun[0];
            derivative.push(diff);
        }
        else if(i == fun.length - 1) {
            // Backward difference
            let diff = fun[fun.length - 1] - fun[fun.length - 2];
            derivative.push(diff);
        }
        else {
            // Central difference
            let diff = (fun[i + 1] - fun[i - 1]) / 2.0;
            derivative.push(diff);
        }
    }

    return derivative;
}

function lowpass(data, windowSize) {

	let movingAverage = [];
    
    for (let i = 0; i < data.length; i++) {
        let start = Math.max(0, i - windowSize + 1);
        let window = data.slice(start, i + 1);
        let sum = window.reduce((acc, val) => acc + val, 0);
        movingAverage.push(sum / window.length);
    }

    return movingAverage;
}

function linearRegression(x, y) {

    const n = x.length;
  
    const sumX = x.reduce((acc, val) => acc + val, 0);
    const sumY = y.reduce((acc, val) => acc + val, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
  
    return [m, b];
  }
  

function solveDecisionTree(closeVariation, volumeVariation) {

	if(closeVariation > 0) {
		if(volumeVariation > 0) return 1;
		else return 2;
	}else if(closeVariation < 0) {
		if(volumeVariation > 0) return 3;
		else return 4;
	}else {
		if(volumeVariation > 0) return 5;
		else return 6;
	}
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
        label: "Close derivative",
        data: closeFunctions[1],
        borderWidth: 1
    });

    closeDerivativeDatasets.push({
        label: "Close second derivative",
        data: closeFunctions[2],
        borderWidth: 1
    });
    
    chart('DerivativeClose' + sufix, dates, closeDerivativeDatasets);

    // Volume Derivative chart
    let volumeDerivativeDatasets = [];

    volumeDerivativeDatasets.push({
        label: "Volume derivative",
        data: volumeFunctions[1],
        borderWidth: 1
    });

    volumeDerivativeDatasets.push({
        label: "Volume second derivative",
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
    let predictButton = document.getElementById('predict-btn');
    predictButton.addEventListener('click', function() {

        predictButton.disabled = true;
        document.getElementById("training-info").innerHTML = "Training neural network...";
        console.log("Starting training...");

        // MLP model
        const inputSize = 6; // [ close, close derivative, close second derivative, volume, volume derivative, volume second derivative ]
        const outputSize = 1; // [ following close ]
        const epochs = 100;
        const batchSize = 16;

        let model = new Model(inputSize, outputSize);

        // Taining and Validation data
        const trainingRatio = 0.99;
        const trainingDays = Math.floor(lastDays * trainingRatio);
        const testDays = lastDays - trainingDays;
        console.log(`Training days ${trainingDays} Validation days ${testDays}`);

        let trainCloseFunctions =  [[], [], []];
        let testCloseFunctions =   [[], [], []];
        let trainVolumeFunctions = [[], [], []];
        let testVolumeFunctions =  [[], [], []];

        let max = 0;
        for(let i = 0; i < closeFunctions.length; i ++) {

            trainCloseFunctions[i] = [...closeFunctions[i]];
            trainVolumeFunctions[i] = [...volumeFunctions[i]];

            trainCloseFunctions[i].splice(-testDays);
            trainVolumeFunctions[i].splice(-testDays);

            testCloseFunctions[i] = [...closeFunctions[i]];
            testVolumeFunctions[i] = [...volumeFunctions[i]];

            testCloseFunctions[i].splice(0, trainingDays);
            testVolumeFunctions[i].splice(0, trainingDays);

            for(let j = 0; j < closeFunctions[i].length; j ++) {

                if(closeFunctions[i][j] > max)
                    max = closeFunctions[i][j];

                if(volumeFunctions[i][j] > max)
                    max = volumeFunctions[i][j];
            }
        }

        console.log('Max value', max)

        let dataLoaderTraining = new DataLoader(trainCloseFunctions, trainVolumeFunctions, max);
        let xTrain = dataLoaderTraining.inputTensor();
        let yTrain = dataLoaderTraining.outputTensor();

        let dataLoaderTest = new DataLoader(testCloseFunctions, testVolumeFunctions, max);
        let xTest = dataLoaderTest.inputTensor();
        let yTest = dataLoaderTest.outputTensor();

        if(xTrain.shape[1] != inputSize)
            console.error(`Model inputSize ${model.inputSize} input tensor shape ${xTrain.shape}`);

        // Training
        model.train(xTrain, yTrain, xTest, yTest, epochs, batchSize).then(history => {

            let lastIndex = closeFunctions[0].length - 1;

            let predictionCloseFunctions =  [
                [closeFunctions[0][lastIndex]], 
                [closeFunctions[1][lastIndex]], 
                [closeFunctions[2][lastIndex]]
            ];

            let predictionVolumeFunctions =  [
                [volumeFunctions[0][lastIndex]], 
                [volumeFunctions[1][lastIndex]], 
                [volumeFunctions[2][lastIndex]]
            ];

            let dataLoaderPrediction = new DataLoader(predictionCloseFunctions, predictionVolumeFunctions, max);
            let xPrediction = dataLoaderPrediction.inputTensor(false);

            // Predict
            model.predict(xPrediction).then(prediction => {
                const value = prediction.arraySync()[0][0] * max;
                console.log(`Next close price ${value.toFixed(2)}$`);
            }).catch(error => {
                console.error("Couldn't predict data", error);
            });
        }).catch(error => { 
            console.error("Couldn't train model", error);
        });
    });
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

    const m = Number(line[0]).toFixed(2);
    const b = Number(line[1]).toFixed(2);

    let pPrediction = document.getElementById("LT-prediction");
    if(m > 0) {
        pPrediction.innerHTML = `<div>y = ${m}x + ${b}</div><div><strong><p>As m > 0:</strong> <strong class="text-success">consider buying</strong></p></div>`;
    }else if (m < 0) {
        pPrediction.innerHTML = `<div>y = ${m}x + ${b}</div><div><strong><p>As m < 0:</strong> <strong class="text-danger">consider selling</strong></p></div>`;
    }else {
        pPrediction.innerHTML = `<div>y = ${m}x + ${b}</div><div><strong><p>As m = 0:</strong> <strong class="text-warning">hold</strong></p></div>`;
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

        let keys = Object.keys(data[pair]);
        let lastEntry = data[pair][keys[keys.length - 1]];

        let diff = lastEntry - data[pair][keys[keys.length - 2]];

		let color = 'lightgreen';
		if(diff < 0) color = 'red';

		let arrow = "&#9650;";
		if(diff < 0) arrow = "&#9660;";

        html += `
        <td>
            <strong class="mb-3" style="display: inline; padding-bottom: 10px;">${Number(lastEntry).toFixed(2)}</strong>
            <p class="mb-3" style="display: inline; margin-left: 3px; color: ${color}; font-weight: bold;">${arrow} ${Number(diff).toFixed(2)}</p>
        </td>
        `
    }

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    html += `<td><strong>${formattedDate}</strong></td><tr>`;
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