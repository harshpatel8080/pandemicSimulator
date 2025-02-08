var barChart;

const createBarGraph = (initialData) => {

	console.log("create graph");
	console.log(initialData);



	const ctx = document.getElementById('barChart').getContext('2d');

	// Initialize Chart.js dataset and labels

	const data = {
		labels: ['Healthy Population', 'Infections', 'Recovered', 'Deaths'],
		datasets: [{
			label: 'Statistics',
			data: [initialData.population, initialData.infected, initialData.recovery, initialData.dead],
			backgroundColor: [
				'rgb(109, 209, 255)',  // Population
				'red',  // Infections
				'rgb(81, 255, 81)',  // Recovered
				'rgb(21, 13, 36)'  // Deaths
			],
			borderColor: [
				'rgba(54, 162, 235, 1)',
				'rgba(255, 99, 132, 1)',
				'rgb(75, 192, 106)',
				'rgba(153, 102, 255, 1)'
			],
			borderWidth: 1
		}]
	};

	// Chart.js configuration
	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
			tooltip: { enabled: true }
		},
		scales: {
			y: {
				beginAtZero: true,
				title: { display: true, text: 'Values' },
			}
		},
		animation: {
			duration: 1000, // Transition duration
		}
	};


	// Add value labels above bars
	const plugins = [{
		id: 'valueLabels',
		afterDatasetsDraw(chart, args, options) {
			const { ctx, data, chartArea: { top, left, right, bottom, width, height } } = chart;

			ctx.save();
			ctx.font = 'bold 12px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.fillStyle = 'white';

			data.datasets.forEach((dataset, i) => {
				const meta = chart.getDatasetMeta(i);

				meta.data.forEach((bar, index) => {
					const value = dataset.data[index];
					const x = bar.x;
					const y = bar.y + 1; 
					ctx.fillText(value, x, y);
				});
			});
		}
	}];

	// Create the chart
	barChart = new Chart(ctx, {
		type: 'bar',
		data: data,
		options: options,
		plugins: plugins
	});

}

const updateBarGraph = (dayData) => {

	barChart.data.datasets[0].data = [
		dayData.population,
		dayData.infected,
		dayData.recovery,
		dayData.dead
	];
	barChart.update(); // Refresh chart

}

