let radarChart; // Chart instance

// Function to create the Radar Chart
function createRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Healthy', 'Infected', 'Recovered', 'Dead', 'One Shot', 'Two Shot'],
            datasets: [{
                label: 'Population Distribution',
                data: [
                    data.populationPercent,
                    data.infectedPercent,
                    data.recoveryPercent,
                    data.deadPercent,
                    data.oneShotPercent,
                    data.twoShotPercent
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { enabled: true }
            },
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { stepSize: 10 }
                }
            }
        }
    });
}

// Function to update the chart dynamically
function updateRadarChart(newData) {
    radarChart.data.datasets[0].data = [
        newData.populationPercent,
        newData.infectedPercent,
        newData.recoveryPercent,
        newData.deadPercent,
        newData.oneShotPercent,
        newData.twoShotPercent
    ];
    radarChart.update(); // Refresh the chart
}