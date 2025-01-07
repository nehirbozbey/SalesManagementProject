async function svgturkiyeharitasi() {
  const element = document.querySelector('#svg-turkiye-haritasi');
  const info = document.querySelector('.il-isimleri');

  if (!element || !info) {
    console.error('Required elements not found');
    return;
  }

  try {
    // Fetch real data from backend
    const response = await fetch('http://localhost:3000/dashboard/turkiye');
    const salesData = await response.json();

    // Find the maximum sales value for scaling
    const maxSales = Math.max(...Object.values(salesData));

    // Color cities based on their sales
    element.querySelectorAll('path').forEach(path => {
      const cityName = path.parentNode.getAttribute('data-iladi');
      const sales = salesData[cityName] || 0;
      const intensity = (sales / maxSales) * 100; // Convert to percentage
      path.style.fill = getColorByIntensity(intensity);
    });

    // Add event listeners
    element.addEventListener('mouseover', function(event) {
      if (event.target.tagName === 'path') {
        const cityName = event.target.parentNode.getAttribute('data-iladi');
        const sales = salesData[cityName] || 0;
        
        info.innerHTML = [
          '<div>',
          `<strong>${cityName}</strong>`,
          `<br>`,
          `Başvuru: ${sales.toLocaleString('tr-TR')}`,
          '</div>'
        ].join('');

        info.style.display = 'block';
        info.style.top = event.pageY + 25 + 'px';
        info.style.left = event.pageX + 'px';

        const originalColor = event.target.style.fill;
        event.target.dataset.originalColor = originalColor;
        event.target.style.fill = darkenColor(originalColor);
      }
    });

    element.addEventListener('mouseout', function(event) {
      info.style.display = 'none';
      if (event.target.tagName === 'path') {
        event.target.style.fill = event.target.dataset.originalColor;
      }
    });

  } catch (error) {
    console.error('Error loading Turkey map data:', error);
  }
}

// Function to generate color based on intensity
function getColorByIntensity(intensity) {
  // Convert intensity (0-100) to opacity (0.1-1)
  const opacity = 0.1 + (intensity * 0.9 / 100);
  return `rgba(30, 144, 255, ${opacity})`; // Using dodgerblue as base color
}

// Function to darken color for hover effect
function darkenColor(color) {
  if (color.startsWith('rgba')) {
    const values = color.match(/[\d.]+/g);
    return `rgba(20, 100, 178, ${values[3]})`; // Darker version of dodgerblue
  }
  return color;
}

// Export the function to make it globally available
window.svgturkiyeharitasi = svgturkiyeharitasi;

