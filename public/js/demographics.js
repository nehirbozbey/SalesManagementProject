import { createBarChart, createPieChart } from './charts.js';
import { initializeMap } from './map.js';

export function initializeDemographicsPage() {
    updateRegionStats();
    createRegionSectorChart();
    createTopCitiesChart();
    createRegionRevenueMap();
}

function updateRegionStats() {
    const stats = {
        marmara: 2850,
        ege: 1920,
        icAnadolu: 1650
    };

    document.getElementById('marmara-applications').textContent = stats.marmara;
    document.getElementById('ege-applications').textContent = stats.ege;
    document.getElementById('ic-anadolu-applications').textContent = stats.icAnadolu;
}

function createRegionSectorChart() {
    const data = {
        labels: ['Marmara', 'Ege', 'İç Anadolu', 'Akdeniz', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu'],
        datasets: [
            {
                label: 'Teknoloji',
                data: [450, 320, 280, 220, 180, 150, 130]
            },
            {
                label: 'Gıda',
                data: [380, 290, 250, 200, 160, 140, 120]
            },
            {
                label: 'Tekstil',
                data: [420, 310, 270, 210, 170, 145, 125]
            }
        ]
    };

    createBarChart('region-sector-chart', 'Bölgelere Göre Sektör Dağılımı', data);
}

function createTopCitiesChart() {
    const data = {
        labels: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'],
        values: [1200, 850, 650, 450, 400]
    };

    createBarChart('top-cities-chart', 'En Çok Başvuru Alınan İller', data);
}

function createRegionRevenueMap() {
    const regions = {
        marmara: 85,
        ege: 70,
        icAnadolu: 65,
        akdeniz: 55,
        karadeniz: 45,
        doguAnadolu: 35,
        guneydoguAnadolu: 30
    };

    initializeMap(regions);
}