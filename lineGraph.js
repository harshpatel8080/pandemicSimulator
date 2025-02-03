const ctx = document.getElementById('lineChart').getContext('2d');
var lineChart

function createLineChart(initialData) {

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 0'], // Initial label
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
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Days' }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Population' }
                }
            }
        }
    });
}


// Function to update the chart dynamically
function updateLineChart(dayData, day) {
    lineChart.data.labels.push('Day ' + day);
    lineChart.data.datasets[0].data.push(dayData.population);
    lineChart.data.datasets[1].data.push(dayData.infected);
    lineChart.data.datasets[2].data.push(dayData.recovery);
    lineChart.data.datasets[3].data.push(dayData.dead);

    lineChart.update();
}


