function initializeApplicationPage() {
    updateApplicationStats();
    initializeAnalytics();
}

function updateApplicationStats() {
    const stats = {
        approvedCount: 856,
        totalCount: 1250,
        rejectedCount: 394,
        totalRevenue: "₺4.8M"
    };

    document.getElementById('approved-applications').textContent = stats.approvedCount;
    document.getElementById('total-applications').textContent = stats.totalCount;
    document.getElementById('rejected-applications').textContent = stats.rejectedCount;
    document.getElementById('application-revenue').textContent = stats.totalRevenue;
}

function initializeAnalytics() {
    // Red sebepleri analizi
    const rejectionReasons = {
        labels: ['Eksik Evrak', 'Düşük Kredi Skoru', 'Yüksek Risk', 'Diğer'],
        values: [45, 30, 15, 10]
    };
    createPieChart('rejection-reasons-chart', 'Red Sebepleri Dağılımı', rejectionReasons);

    // Sektör bazlı red sebepleri
    const sectorRejections = {
        labels: ['Teknoloji', 'Gıda', 'Tekstil', 'Otomotiv', 'Sağlık'],
        datasets: [
            {
                label: 'Eksik Evrak',
                data: [15, 10, 8, 12, 5]
            },
            {
                label: 'Düşük Kredi Skoru',
                data: [8, 12, 15, 5, 10]
            },
            {
                label: 'Yüksek Risk',
                data: [5, 8, 10, 15, 12]
            }
        ]
    };
    createBarChart('sector-rejections-chart', 'Sektör Bazlı Red Sebepleri', sectorRejections);

    // Sektör bazlı onaylanan başvurular
    const sectorApprovals = {
        labels: ['Teknoloji', 'Gıda', 'Tekstil', 'Otomotiv', 'Sağlık'],
        values: [120, 85, 95, 110, 75]
    };
    createBarChart('sector-approvals-chart', 'Sektör Bazlı Onaylanan Başvurular', sectorApprovals);
}