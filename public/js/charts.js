export function createLineChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: data.label || 'Veri',
                data: data.values,
                borderColor: '#2c3e50',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: data.title || ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

export function createBarChart(elementId, title, data) {
    const ctx = document.getElementById(elementId).getContext('2d');
    
    const datasets = data.datasets || [{
        label: 'Veri',
        data: data.values,
        backgroundColor: '#2c3e50'
    }];

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

export function createPieChart(elementId, title, data) {
    const ctx = document.getElementById(elementId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#2c3e50',
                    '#34495e',
                    '#7f8c8d',
                    '#95a5a6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}