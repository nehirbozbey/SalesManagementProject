function initializeSectorPage() {
    createRevenueChart();
    createCommissionChart();
    createApplicationChart();
    createRegionDistributionMap();
}

function createRevenueChart() {
    const data = {
        labels: ['Teknoloji', 'Gıda', 'Tekstil', 'Otomotiv', 'Sağlık'],
        values: [1200000, 850000, 2100000, 3500000, 1800000],
        label: 'Ciro (₺)'
    };
    createBarChart('sector-revenue-chart', 'Sektörlere Göre Ciro Dağılımı', data);
}

function createCommissionChart() {
    const data = {
        labels: ['Teknoloji', 'Gıda', 'Tekstil', 'Otomotiv', 'Sağlık'],
        values: [180000, 102000, 210000, 630000, 360000],
        label: 'Komisyon (₺)'
    };
    createBarChart('sector-commission-chart', 'Sektörlere Göre Komisyon Dağılımı', data);
}

function createApplicationChart() {
    const data = {
        labels: ['Teknoloji', 'Gıda', 'Tekstil', 'Otomotiv', 'Sağlık'],
        values: [450, 380, 420, 350, 300]
    };
    createPieChart('sector-application-chart', 'Sektörlere Göre Başvuru Dağılımı', data);
}

function createRegionDistributionMap() {
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