async function runRNN(closeData, volumeData, timesteps, predictionDays, epochs, batchSize) {
	// Preparamos xs (entradas) y ys (salidas)
	const xs = [];
	const ys = [];

	for (let i = 0; i < closeData.length - timesteps; i++) {
		const windowX = [];
		for (let j = 0; j < timesteps; j++) {
			windowX.push([closeData[i + j], volumeData[i + j]]);
		}
		xs.push(windowX);
		ys.push([closeData[i + timesteps]]);
	}

	// Convertimos a tensores
	const xsTensor = tf.tensor3d(xs); // [n_samples, timesteps, features]
	const ysTensor = tf.tensor2d(ys); // [n_samples, 1]

	// Modelo
	const model = tf.sequential();
	model.add(tf.layers.simpleRNN({
		units: 128,
		activation: 'relu',
		inputShape: [timesteps, 2] // timesteps y características (precio, volumen)
	}));
	model.add(tf.layers.dense({ units: 32 }));
	model.add(tf.layers.dense({ units: 1 }));

	model.compile({
		optimizer: tf.train.rmsprop(0.001),  // Aquí 0.001 es el learning rate
		loss: 'meanSquaredError',
		metrics: ['mae']
	});

	// Mostrar progreso en un div
	const trainingInfoDiv = document.getElementById('training-info');
	const callback = {
		onEpochEnd: async (epoch, logs) => {
			trainingInfoDiv.innerText = `[${epoch + 1} / ${epochs}] --> Loss: ${logs.loss.toFixed(4)} MAE: ${logs.mae.toFixed(4)}</p>`;
		}
	};

	// Entrenamiento
	const history = await model.fit(xsTensor, ysTensor, {
		epochs: epochs,
		batchSize: batchSize,
		callbacks: callback
	});

	console.log('Training info: ', history);

	// Predicción para los siguientes 10 días
	let predictions = [];
	let lastWindow = xs[xs.length - 1]; // Última ventana de datos

	for (let i = 0; i < predictionDays; i++) {

		const inputTensor = tf.tensor3d([lastWindow]); // Convertimos la ventana a tensor
		const prediction = model.predict(inputTensor); // Hacemos una predicción
		const predictedPrice = prediction.arraySync()[0][0]; // Convertimos a número
		predictions.push(predictedPrice);

		// Estimamos el volumen o usamos un valor fijo (puedes modificar esta lógica)
		const predictedVolume = volumeData[volumeData.length - 1];

		// Actualizamos la ventana para incluir el nuevo valor
		lastWindow.shift();
		lastWindow.push([predictedPrice, predictedVolume]);
	}

	return predictions;
}