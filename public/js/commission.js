document.addEventListener('DOMContentLoaded', () => {
    initializeCommissionPage();
});

export function initializeCommissionPage() {
    loadCommissionTable();
    initializeSimulator();
}

function loadCommissionTable() {
    const tableData = [
        { sector: "Teknoloji", rate: 15, revenue: "₺1.2M", commission: "₺180K" },
        { sector: "Gıda", rate: 12, revenue: "₺850K", commission: "₺102K" },
        { sector: "Tekstil", rate: 10, revenue: "₺2.1M", commission: "₺210K" },
        { sector: "Otomotiv", rate: 18, revenue: "₺3.5M", commission: "₺630K" },
        { sector: "Sağlık", rate: 20, revenue: "₺1.8M", commission: "₺360K" }
    ];

    const tbody = document.querySelector('#commission-table tbody');
    tbody.innerHTML = tableData.map(row => `
        <tr>
            <td>${row.sector}</td>
            <td>%${row.rate}</td>
            <td>${row.revenue}</td>
            <td>${row.commission}</td>
        </tr>
    `).join('');
}

function initializeSimulator() {
    const form = document.getElementById('commission-simulator');
    const resultDiv = document.getElementById('simulation-result');

    const commissionRates = {
        "teknoloji": 15,
        "gida": 12,
        "tekstil": 10,
        "otomotiv": 18,
        "saglik": 20
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sector = form.sector.value;
        const revenue = parseFloat(form.revenue.value);
        const rate = commissionRates[sector];

        if (!sector || !revenue || revenue <= 0) {
            resultDiv.innerHTML = '<p class="error">Lütfen geçerli bir sektör ve ciro giriniz.</p>';
            return;
        }

        const commission = (revenue * rate) / 100;
        const yearlyCommission = commission * 12;

        resultDiv.innerHTML = `
            <div class="result-card">
                <h3>Hesaplama Sonucu</h3>
                <p>Seçilen Sektör: <strong>${sector.charAt(0).toUpperCase() + sector.slice(1)}</strong></p>
                <p>Komisyon Oranı: <strong>%${rate}</strong></p>
                <p>Aylık Komisyon: <strong>₺${commission.toLocaleString()}</strong></p>
                <p>Yıllık Tahmini Komisyon: <strong>₺${yearlyCommission.toLocaleString()}</strong></p>
            </div>
        `;
    });
}
