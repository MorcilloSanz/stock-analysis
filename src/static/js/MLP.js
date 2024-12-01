class DataLoader {

	/**
	 * @param {*} closeFunctions [ close (smooth), close derivative, close second derivative ]
	 * @param {*} volumeFunctions [ volume (smooth), volume derivative, volume second derivative ]
	 */
	constructor(closeFunctions, volumeFunctions) {
		this.closeFunctions = closeFunctions;
		this.volumeFunctions = volumeFunctions;
	}

	/**
	 * Returns the input tensor [[close, volume, close derivative, volume derivative, close second derivative, volume second derivative]]
	 * @param {*} removeLast remove last element or not
	 * @returns the input tensor
	 * 
	 *  t1, t2, t3, t4
	 *	f1, f2, f3  remove last element
	 *	c2, c3, c4  remove first element
	 */
	inputTensor(removeLast = true) {

		let tensor = [];

		let j = 1;
		if(!removeLast) j = 0;

		for(let i = 0; i < this.closeFunctions[0].length - j; i ++) {

			let row = [];

			for(let j = 0; j < this.closeFunctions.length; j ++) {
				row.push(this.closeFunctions[j][i]);
				if(j < this.volumeFunctions.length)
					row.push(this.volumeFunctions[j][i]);
			}

			tensor.push(row);
		}

		return tf.tensor2d(tensor);
	}

	/**
	 * Returns the output tensor
	 * @returns the output tensor
	 * 
	 *  t1, t2, t3, t4
	 *	f1, f2, f3  remove last element
	 *	c2, c3, c4  remove first element
	 */
	outputTensor() {
		let tensor = [...this.closeFunctions[0]];
		tensor.shift();
		return tf.tensor1d(tensor);
	}
}

class Model {

	/**
	 * @param {*} inputSize input layer neurons
	 * @param {*} outputSize output layer neurons
	 */
	constructor(inputSize, outputSize) {

		this.inputSize = inputSize;
		this.outputSize = outputSize;

		this.model = tf.sequential();

		this.model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [this.inputSize] }));
		this.model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
		this.model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
		this.model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
		this.model.add(tf.layers.dense({ units: outputSize, activation: 'relu' }));

		this.model.compile({
			optimizer: 'adam',
			loss: 'meanSquaredError',
			metrics: ['accuracy', 'mae']
		});
	}

	async train(xTrain, yTrain, epochs, batchSize) {

		const callback = {
			onEpochEnd: async (epoch, logs) => {
				let output = `[${epoch + 1} / ${epochs}] Accuracy: ${logs.acc.toFixed(4)} Loss: ${logs.loss.toFixed(4)} MAE: ${logs.mae.toFixed(4)}`;
				console.log(output);
			}
		};

		return await this.model.fit(xTrain, yTrain, {
			epochs: epochs,
			batchSize: batchSize,
			//validationData: [xTest, yTest],
			callbacks: callback
		});
	}

	async predict(xPredict) {
		return await this.model.predict(xPredict);
	}
}