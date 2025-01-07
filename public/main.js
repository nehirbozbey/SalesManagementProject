document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');

    // Sayfa geçişlerini yönet
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktif link stilini güncelle
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // İlgili sayfayı göster
            const pageId = link.getAttribute('data-page');
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === pageId) {
                    page.classList.add('active');
                }
            });

            // Sayfa özel initialize fonksiyonlarını çağır
            if (pageId === 'home') {
                initializeDashboard();
            } else if (pageId === 'commission') {
                initializeCommissionPage();
            } else if (pageId === 'application') {
                initializeApplicationPage();
            } else if (pageId === 'product'){
                initializeProductPage();
            } else if (pageId === 'sector'){
                initializeSectorPage();
            } else if (pageId === 'demography'){
                initializeDemographicsPage();
            }
        });
    });

    // İlk sayfa yüklemesi
    initializeDashboard();
    const charts = {
        regionApplications: ChartManager.createRegionApplicationsChart(),
        regionRevenue: ChartManager.createRegionRevenueChart(),
        cityApplications: ChartManager.createCityApplicationsChart(),
        regionSectors: ChartManager.createRegionSectorsChart()
    };

    // Türkiye haritası için placeholder
    const mapContainer = document.getElementById('turkeyMap');
    const mapImage = document.createElement('img');
    mapImage.src = 'https://via.placeholder.com/1200x400?text=Turkiye+Haritasi';
    mapImage.style.width = '100%';
    mapImage.style.height = '100%';
    mapImage.style.objectFit = 'contain';
    mapContainer.appendChild(mapImage);

    // Pencere yeniden boyutlandığında grafikleri güncelle
    window.addEventListener('resize', function() {
        Object.values(charts).forEach(chart => chart.resize());
    });
});

// API endpoint'leri için temel URL
const API_BASE_URL = 'http://localhost:3000';

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    // Aktif sayfayı güncelle
    updateActivePage();
    // İlk sayfa verilerini yükle
    loadDashboardData();
});

// Menü tıklamalarını dinle
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        switchPage(page);
    });
});

// Sayfalar arası geçiş
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    loadPageData(pageId);
}

// Sayfa verilerini yükle
function loadPageData(pageId) {
    switch(pageId) {
        case 'home':
            loadDashboardData();
            break;
        case 'commission':
            loadCommissionData();
            break;
        case 'application':
            loadApplicationData();
            break;
        case 'demography':
            loadDemographyData();
            break;
        case 'sector':
            loadSectorData();
            break;
        case 'product':
            loadProductData();
            break;
    }
}

// Dashboard verilerini yükle
async function loadDashboardData() {
    try {
        const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`);
        const stats = await statsResponse.json();
        
        document.getElementById('daily-applications').textContent = stats.daily_applications;
        document.getElementById('rejections').textContent = stats.rejections;
        document.getElementById('total-revenue').textContent = `₺${stats.total_revenue.toLocaleString()}`;
        document.getElementById('active-region').textContent = stats.active_region;
        
        loadWeeklySalesChart();
    } catch (error) {
        console.error('Dashboard veri yükleme hatası:', error);
    }
}

// Komisyon verilerini yükle
async function loadCommissionData() {
    try {
        const response = await fetch(`${API_BASE_URL}/commission/stats`);
        const data = await response.json();
        
        updateCommissionTable(data);
    } catch (error) {
        console.error('Komisyon veri yükleme hatası:', error);
    }
}

// Başvuru verilerini yükle
async function loadApplicationData() {
    try {
        const statsResponse = await fetch(`${API_BASE_URL}/applications/stats`);
        const stats = await statsResponse.json();
        
        document.getElementById('approved-applications').textContent = stats.approved;
        document.getElementById('total-applications').textContent = stats.total;
        document.getElementById('rejected-applications').textContent = stats.rejected;
        document.getElementById('application-revenue').textContent = `₺${stats.total_revenue.toLocaleString()}`;
        
        loadRejectionReasonsChart();
    } catch (error) {
        console.error('Başvuru veri yükleme hatası:', error);
    }
}

// Demografi verilerini yükle
async function loadDemographyData() {
    try {
        const regionalResponse = await fetch(`${API_BASE_URL}/demographics/regional`);
        const regionalData = await regionalResponse.json();
        
        const cityResponse = await fetch(`${API_BASE_URL}/demographics/city-stats`);
        const cityData = await cityResponse.json();
        
        updateDemographyCharts(regionalData, cityData);
    } catch (error) {
        console.error('Demografi veri yükleme hatası:', error);
    }
}

// Sektör verilerini yükle
async function loadSectorData() {
    try {
        const filters = getActiveFilters();
        const response = await fetch(`${API_BASE_URL}/sectors/analysis?${new URLSearchParams(filters)}`);
        const data = await response.json();
        
        updateSectorCharts(data);
    } catch (error) {
        console.error('Sektör veri yükleme hatası:', error);
    }
}

// Ürün verilerini yükle
async function loadProductData() {
    try {
        const missingResponse = await fetch(`${API_BASE_URL}/products/missing-analysis`);
        const missingData = await missingResponse.json();
        
        const sectorResponse = await fetch(`${API_BASE_URL}/products/sector-analysis`);
        const sectorData = await sectorResponse.json();
        
        updateProductCharts(missingData, sectorData);
    } catch (error) {
        console.error('Ürün veri yükleme hatası:', error);
    }
}

// Grafik güncelleme fonksiyonları
function loadWeeklySalesChart() {
    // Chart.js kullanarak grafik oluştur
    const ctx = document.getElementById('salesChart').getContext('2d');
    // Grafik kodları...
}

function updateCommissionTable(data) {
    const tbody = document.querySelector('#commission table tbody');
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.sector}</td>
            <td>%${item.commission_rate}</td>
            <td>₺${item.total_revenue.toLocaleString()}</td>
            <td>₺${item.total_commission.toLocaleString()}</td>
        </tr>
    `).join('');
}

function loadRejectionReasonsChart() {
    // Grafik kodları...
}

function updateDemographyCharts(regionalData, cityData) {
    // Grafik kodları...
}

function updateSectorCharts(data) {
    // Grafik kodları...
}

function updateProductCharts(missingData, sectorData) {
    // Grafik kodları...
}

// Yardımcı fonksiyonlar
function getActiveFilters() {
    return {
        startDate: document.querySelector('#dateRange').value,
        sectors: Array.from(document.querySelector('#sectorFilter').selectedOptions).map(opt => opt.value).join(','),
        regions: Array.from(document.querySelector('#regionFilter').selectedOptions).map(opt => opt.value).join(',')
    };
}