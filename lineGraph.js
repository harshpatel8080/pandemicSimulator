// Get the context of the canvas for the line chart
const ctx = document.getElementById('lineChart').getContext('2d');
var lineChart;

// Function to create the initial line chart with given data
function createLineChart(initialData) {
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 0'], // Initial label for the x-axis
            datasets: [
                {
                    label: 'Healthy Population',
                    data: [initialData.population],
                    borderColor: 'rgb(109, 209, 255)',
                    backgroundColor: 'rgba(109, 209, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Infected',
                    data: [initialData.infected],
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Recovered',
                    data: [initialData.recovery],
                    borderColor: 'rgb(81, 255, 81)',
                    backgroundColor: 'rgba(81, 255, 81, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Dead',
                    data: [initialData.dead],
                    borderColor: 'rgb(21, 13, 36)',
                    backgroundColor: 'rgba(21, 13, 36, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }, // Show legend
                tooltip: { enabled: true } // Enable tooltips
            },
            scales: {
                x: {
                    title: { display: true, text: 'Days' } // X-axis title
                },
                y: {
                    beginAtZero: true, // Start y-axis at zero
                    title: { display: true, text: 'Population' } // Y-axis title
                }
            }
        }
    });
}

// Function to update the chart dynamically with new data
function updateLineChart(dayData, day) {
    lineChart.data.labels.push('Day ' + day); // Add new day label
    lineChart.data.datasets[0].data.push(dayData.population); // Update healthy population data
    lineChart.data.datasets[1].data.push(dayData.infected); // Update infected data
    lineChart.data.datasets[2].data.push(dayData.recovery); // Update recovered data
    lineChart.data.datasets[3].data.push(dayData.dead); // Update dead data

    lineChart.update(); // Refresh the chart to display new data
}