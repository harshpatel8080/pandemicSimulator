let doughnutChart; // Chart instance

// Function to create the Doughnut Chart
function createPieChart(data) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');

    doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Healthy', 'Infected', 'Recovered', 'Dead', 'One Shot', 'Two Shot'],
            datasets: [{
                label: 'Population Distribution',
                data: [
                    data.healthyPercent,
                    data.infectedPercent,
                    data.recoveredPercent,
                    data.deadPercent,
                    data.oneShotPercent,
                    data.twoShotPercent
                ],
                backgroundColor: [
                    'rgb(109, 209, 255)',  // Healthy
                    'red',                 // Infected
                    'rgb(81, 255, 81)',    // Recovered
                    'rgb(21, 13, 36)',     // Dead
                    'orange',              // One Shot
                    'purple'               // Two Shot
                ],
                borderColor: ['#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'right' },
                tooltip: { enabled: true }
            }
        }
    });
}

// Function to update the chart dynamically
function updatePieChart(newData) {
    doughnutChart.data.datasets[0].data = [
        newData.populationPercent,
        newData.infectedPercent,
        newData.recoveryPercent,
        newData.deadPercent,
        newData.oneShotPercent,
        newData.twoShotPercent
    ];
    doughnutChart.update();
}