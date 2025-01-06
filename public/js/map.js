function initializeMap() {
    const regions = {
        istanbul: 85,
        ankara: 65,
        izmir: 75,
        antalya: 45,
        // Diğer iller...
    };

    document.querySelectorAll('.turkey-map path').forEach(path => {
        const regionName = path.getAttribute('data-name').toLowerCase();
        const intensity = regions[regionName] || 20;
        const color = getColorByIntensity(intensity);
        path.style.fill = color;

        // Hover efekti
        path.addEventListener('mouseover', (e) => {
            const region = e.target.getAttribute('data-name');
            const value = regions[region.toLowerCase()] || 0;
            showTooltip(e, `${region}: ${value}%`);
        });

        path.addEventListener('mouseout', () => {
            hideTooltip();
        });
    });
}

function getColorByIntensity(intensity) {
    // Renk yoğunluğunu hesapla (açık maviden koyu maviye)
    const baseColor = [44, 62, 80]; // #2c3e50
    const opacity = intensity / 100;
    return `rgba(${baseColor.join(',')},${opacity})`;
}

function showTooltip(event, text) {
    const tooltip = document.getElementById('map-tooltip');
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY + 10 + 'px';
}

function hideTooltip() {
    document.getElementById('map-tooltip').style.display = 'none';
}