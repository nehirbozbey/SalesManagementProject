async function initializeApplicationPage() {
    try {
        const response = await fetch('http://localhost:3000/basvuru/analytics');
        const data = await response.json();
        
        // Update stats
        const stats = data.stats;
        document.getElementById('approved-applications').textContent = stats.approvedCount;
        document.getElementById('total-applications').textContent = stats.totalCount;
        document.getElementById('rejected-applications').textContent = stats.rejectedCount;
        document.getElementById('application-revenue').textContent = stats.totalRevenue;

        // Red sebepleri chart
        createPieChart('rejection-reasons-chart', 'Red Sebepleri Dağılımı', data.redSebepler);

        // Process sector data for charts
        const sectors = [...new Set(data.sektorData.map(d => d.sektor_ad))];
        
        // Sector approvals chart
        const sectorApprovals = {
            labels: sectors,
            values: sectors.map(sector => {
                const matches = data.sektorData.filter(d => 
                    d.sektor_ad === sector && d.durum === '3'
                );
                return matches.reduce((sum, m) => sum + m.count, 0);
            })
        };
        createBarChart('sector-approvals-chart', 'Sektör Bazlı Onaylanan Başvurular', sectorApprovals);

        // Sector rejections chart
        const redSebepler = [...new Set(data.sektorData
            .filter(d => d.red_sebep)
            .map(d => d.red_sebep))];

        const sectorRejections = {
            labels: sectors,
            datasets: redSebepler.map(sebep => ({
                label: sebep,
                data: sectors.map(sector => {
                    const match = data.sektorData.find(d => 
                        d.sektor_ad === sector && 
                        d.red_sebep === sebep
                    );
                    return match ? match.count : 0;
                })
            }))
        };
        createBarChart('sector-rejections-chart', 'Sektör Bazlı Red Sebepleri', sectorRejections);

    } catch (error) {
        console.error('Error initializing application page:', error);
    }
}