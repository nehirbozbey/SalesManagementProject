async function initializeDemographicsPage() {
    try {
        const response = await fetch('http://localhost:3000/demographics/regional');
        const data = await response.json();
        
        updateRegionStats(data.bolgeselIstatistikler);
        createRegionSectorChart(data.sektorDagilimi);
        createTopCitiesChart(data.populerIller);
        createRegionRevenueMap(data.bolgeselIstatistikler);
    } catch (error) {
        console.error('Error initializing demographics page:', error);
    }
}

function updateRegionStats(stats) {
    const container = document.getElementById('region-stats-container');
    container.innerHTML = ''; // Clear existing cards
    
    // Sort stats by total applications in descending order
    stats.sort((a, b) => b.toplam_basvuru - a.toplam_basvuru);
    
    // Create a card for each region
    stats.forEach(stat => {
        // Calculate rejection rate and pending applications
        const redOrani = ((stat.reddedilen / stat.toplam_basvuru) * 100).toFixed(1);
        
        // Format currency
        const formattedCiro = new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(stat.toplam_ciro);

        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div class="stat-card-header">
                <h3>${stat.bolge_adi}</h3>
                <div class="total-applications">
                    <span class="number">${stat.toplam_basvuru}</span>
                    <span class="label">Toplam Başvuru</span>
                </div>
            </div>
            <div class="stat-card-body">
                <div class="stat-item">
                    <i class="fas fa-check-circle"></i>
                    <div class="stat-info">
                        <span class="number">${stat.onaylanan}</span>
                        <span class="label">Onaylanan</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-times-circle"></i>
                    <div class="stat-info">
                        <span class="number">${redOrani}%</span>
                        <span class="label">Red Oranı</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <div class="stat-info">
                        <span class="number">${stat.bekleyen}</span>
                        <span class="label">Bekleyen</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-lira-sign"></i>
                    <div class="stat-info">
                        <span class="number">${formattedCiro}</span>
                        <span class="label">Toplam Ciro</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function createRegionSectorChart(sektorData) {
    // Group data by region and sector
    const regions = [...new Set(sektorData.map(item => item.bolge_adi))];
    const sectors = [...new Set(sektorData.map(item => item.sektor))];
    
    const data = {
        labels: regions,
        datasets: sectors.map(sector => ({
            label: sector,
            data: regions.map(region => {
                const match = sektorData.find(item => 
                    item.bolge_adi === region && 
                    item.sektor === sector
                );
                return match ? match.adet : 0;
            })
        }))
    };

    createBarChart('region-sector-chart', 'Bölgelere Göre Sektör Dağılımı', data);
}

function createTopCitiesChart(data) {
    createBarChart('top-cities-chart', 'En Çok Başvuru Alınan İller', data);
}

function createRegionRevenueMap(stats) {
    // Convert stats to the format expected by the map
    const regions = stats.reduce((acc, stat) => {
        // Convert revenue to millions and round to 2 decimal places
        const revenueInMillions = Math.round((stat.toplam_ciro / 1000000) * 100) / 100;
        
        // Convert region names to camelCase keys
        const regionKey = stat.bolge_adi.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ç/g, 'c')
            .replace(/\s+/g, '')
            .replace(/İ/g, 'i');
        
        acc[regionKey] = revenueInMillions;
        return acc;
    }, {});

    initializeMap(regions);
}