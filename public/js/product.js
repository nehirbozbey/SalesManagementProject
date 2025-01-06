function initializeProductPage() {
    initializeProductSelector();
    updateCharts('sanalpos'); // Varsayılan olarak sanalpos seçili
}

function initializeProductSelector() {
    const selector = document.getElementById('product-selector');
    if (!selector) return;

    selector.addEventListener('change', (e) => {
        updateCharts(e.target.value);
    });
}

function updateCharts(product) {
    const data = getProductData(product);
    createCustomerChart(data);
    createSectorChart(data);
    createCommissionChart(data);
    createRevenueChart(data);
}

function getProductData(product) {
    const productData = {
        sanalpos: {
            customers: [1200, 800, 600, 400],
            sectors: [450, 380, 420, 350, 300],
            commission: 180000,
            revenue: 1200000
        },
        fizikipos: {
            customers: [900, 700, 500, 300],
            sectors: [400, 350, 380, 320, 280],
            commission: 150000,
            revenue: 1000000
        },
        yazarkasa: {
            customers: [600, 400, 300, 200],
            sectors: [300, 250, 280, 220, 180],
            commission: 120000,
            revenue: 800000
        },
        barkodokuyucu: {
            customers: [300, 200, 150, 100],
            sectors: [150, 120, 140, 110, 90],
            commission: 90000,
            revenue: 600000
        }
    };

    return productData[product];
}

function createCustomerChart(data) {
    const chartData = {
        labels: ['Büyük Ölçekli', 'Orta Ölçekli', 'Küçük Ölçekli', 'Mikro'],
        values: data.customers
    };
    createPieChart('product-customer-chart', 'Müşteri Segmenti Dağılımı', chartData);
}

function createSectorChart(data) {
    const chartData = {
        labels: ['Teknoloji', 'Gıda', 'Tekstil', 'Otomotiv', 'Sağlık'],
        values: data.sectors
    };
    createBarChart('product-sector-chart', 'Sektör Dağılımı', chartData);
}

function createCommissionChart(data) {
    const chartData = {
        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
        values: [
            data.commission * 0.8,
            data.commission * 0.9,
            data.commission * 1.0,
            data.commission * 1.1,
            data.commission * 1.2,
            data.commission * 1.3
        ],
        label: 'Komisyon (₺)'
    };
    createBarChart('product-commission-chart', 'Aylık Komisyon Trendi', chartData);
}

function createRevenueChart(data) {
    const chartData = {
        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
        values: [
            data.revenue * 0.8,
            data.revenue * 0.9,
            data.revenue * 1.0,
            data.revenue * 1.1,
            data.revenue * 1.2,
            data.revenue * 1.3
        ],
        label: 'Ciro (₺)'
    };
    createBarChart('product-revenue-chart', 'Aylık Ciro Trendi', chartData);
}



/*export function initializeProductPage(){
    createCharts()
    openTab()
    fillTables()
    applyFilters()
}


// Örnek veriler
    const noProductsData = [
        {
            product: "Ürün A",
            missingCustomers: 45,
            potentialRevenue: 900000,
            action: "Email kampanyası"
        },
        {
            product: "Ürün B",
            missingCustomers: 38,
            potentialRevenue: 760000,
            action: "Telefon görüşmesi"
        },
        {
            product: "Ürün C",
            missingCustomers: 29,
            potentialRevenue: 580000,
            action: "Özel teklif"
        }
    ];

    const sectorData = [
        {
            sector: "Teknoloji",
            customers: 85,
            avgProducts: 4.2,
            penetration: "88"
        },
        {
            sector: "Perakende",
            customers: 120,
            avgProducts: 3.8,
            penetration: "75"
        },
        {
            sector: "Üretim",
            customers: 95,
            avgProducts: 3.5,
            penetration: "70"
        }
    ];

    // Tab değiştirme fonksiyonu
    function openTab(tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        const tabButtons = document.getElementsByClassName('tab-button');
        
        for (let content of tabContents) {
            content.classList.remove('active');
        }
        
        for (let button of tabButtons) {
            button.classList.remove('active');
        }
        
        document.getElementById(tabName).classList.add('active');
        event.currentTarget.classList.add('active');
    }

    // Grafikleri oluştur
    function createCharts() {
        // Sektör Dağılımı Pasta Grafiği
        const sectorCtx = document.getElementById('sectorChart').getContext('2d');
        new Chart(sectorCtx, {
            type: 'pie',
            data: {
                labels: sectorData.map(item => item.sector),
                datasets: [{
                    data: sectorData.map(item => item.customers),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Aylık Trend Çizgi Grafiği
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                datasets: [{
                    label: 'Aylık Satış Trendi',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#36A2EB',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Eksik Ürünler Bar Grafiği
        const missingCtx = document.getElementById('missingProductsChart').getContext('2d');
        new Chart(missingCtx, {
            type: 'bar',
            data: {
                labels: noProductsData.map(item => item.product),
                datasets: [{
                    label: 'Almayan Müşteri Sayısı',
                    data: noProductsData.map(item => item.missingCustomers),
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Sektör Analizi Radar Grafiği
        const sectorAnalysisCtx = document.getElementById('sectorAnalysisChart').getContext('2d');
        new Chart(sectorAnalysisCtx, {
            type: 'radar',
            data: {
                labels: sectorData.map(item => item.sector),
                datasets: [{
                    label: 'Penetrasyon Oranı',
                    data: sectorData.map(item => item.penetration),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: '#36A2EB'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Tabloları doldur
    function fillTables() {
        const noProductsTable = document.getElementById('noProductsTable');
        const sectorTable = document.getElementById('sectorTable');

        // Eksik ürünler tablosu
        noProductsTable.innerHTML = noProductsData.map(item => `
            <tr>
                <td>${item.product}</td>
                <td>${item.missingCustomers}</td>
                <td>${item.potentialRevenue.toLocaleString()} ₺</td>
                <td>${item.action}</td>
            </tr>
        `).join('');

        // Sektör tablosu
        sectorTable.innerHTML = sectorData.map(item => `
            <tr>
                <td>${item.sector}</td>
                <td>${item.customers}</td>
                <td>${item.avgProducts}</td>
                <td>%${item.penetration}</td>
            </tr>
        `).join('');
    }

    // Filtreleme fonksiyonu
    function applyFilters() {
        const sectorFilter = document.getElementById('sectorFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        // Burada gerçek bir API'den veri çekilebilir
        // Şimdilik sadece console'a yazdıralım
        console.log('Filtreler uygulandı:', {
            sector: sectorFilter,
            date: dateFilter
        });
        
        // Filtrelenmiş verilere göre grafikleri ve tabloları güncelle
        // Örnek olarak mevcut verileri tekrar yükleyelim
        createCharts();
        fillTables();
    }*/

    
