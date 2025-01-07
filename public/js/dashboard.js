function initializeDashboard() {
    updateStatCards();
    initializeMap();
    createSalesChart();
}

async function updateStatCards() {
    const response = await fetch("http://localhost:3000/dashboard/stats");
    const data = await response.json();

    const stats = {
        dailyApplications: data.dailyApplications,
        rejections: data.rejections,
        totalRevenue: data.totalRevenue,
        activeRegion: data.activeRegion
    };

    document.getElementById('daily-applications').textContent = stats.dailyApplications;
    document.getElementById('rejections').textContent = stats.rejections;
    document.getElementById('total-revenue').textContent = stats.totalRevenue;
    document.getElementById('active-region').textContent = stats.activeRegion;
}

async function createSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    try {
        const response = await fetch('http://localhost:3000/dashboard/7-gun');
        const data = await response.json();
        
        const chartData = {
            labels: data.map(item => new Date(item.date).toLocaleDateString('tr-TR', { weekday: 'long' })),
            values: data.map(item => item.count)
        };
        
        createLineChart(ctx, chartData);
    } catch (error) {
        console.error('Error fetching chart data:', error);
        // Fallback to default data if fetch fails
        const defaultData = {
            labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
            values: [0, 0, 0, 0, 0, 0, 0]
        };
        createLineChart(ctx, defaultData);
    }
}