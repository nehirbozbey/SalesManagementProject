document.addEventListener('DOMContentLoaded', () => {
    initializeCommissionPage();
});

function initializeCommissionPage() {
    loadCommissionTable();
    initializeSimulator();
}

async function loadCommissionTable() {
    const tbody = document.querySelector('#commission-table tbody');
    
    try {
        const response = await fetch('http://localhost:3000/commission/summary');
        const data = await response.json();
        
        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${row.sector}</td>
                <td>%${row.rate}</td>
                <td>₺${formatNumber(row.revenue)}</td>
                <td>₺${formatNumber(row.commission)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading commission table:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="error">Veriler yüklenirken bir hata oluştu.</td></tr>';
    }
}

function formatNumber(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
}

async function initializeSimulator() {
    const form = document.getElementById('commission-simulator');
    const resultDiv = document.getElementById('simulation-result');
    let commissionRates = {};

    try {
        const response = await fetch('http://localhost:3000/commission/rates');
        commissionRates = await response.json();
    } catch (error) {
        console.error('Error fetching commission rates:', error);
        resultDiv.innerHTML = '<p class="error">Komisyon oranları yüklenirken bir hata oluştu.</p>';
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sector = form.sector.value;
        const revenue = parseFloat(form.revenue.value);
        const rate = commissionRates[sector];

        console.log(sector, revenue, rate);
        if (!sector || !revenue || revenue <= 0 || !rate) {
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
