import { createLineChart } from './charts.js';
import { initializeMap } from './map.js';

export function initializeDashboard() {
    updateStatCards();
    initializeMap();
    createSalesChart();
}

function updateStatCards() {
    const stats = {
        dailyApplications: 145,
        rejections: 23,
        totalRevenue: "₺2.8M",
        activeRegion: "İstanbul"
    };

    document.getElementById('daily-applications').textContent = stats.dailyApplications;
    document.getElementById('rejections').textContent = stats.rejections;
    document.getElementById('total-revenue').textContent = stats.totalRevenue;
    document.getElementById('active-region').textContent = stats.activeRegion;
}


function createSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const data = {
        labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
        values: [65, 59, 80, 81, 56, 55, 70]
    };
    
    createLineChart(ctx, data);
}