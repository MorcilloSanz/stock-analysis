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