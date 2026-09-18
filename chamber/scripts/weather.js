// Current date + live weather widget for the Chamber home page.
// Uses Open-Meteo (https://open-meteo.com) - a free forecast API that needs no API key.

const RICHMOND_LAT = 37.5407;
const RICHMOND_LON = -77.436;

// Simplified WMO weather code -> { icon, label } lookup
const WEATHER_CODES = {
    0: { icon: '☀️', label: 'Clear sky' },
    1: { icon: '🌤️', label: 'Mostly clear' },
    2: { icon: '⛅', label: 'Partly cloudy' },
    3: { icon: '☁️', label: 'Overcast' },
    45: { icon: '🌫️', label: 'Fog' },
    48: { icon: '🌫️', label: 'Fog' },
    51: { icon: '🌦️', label: 'Light drizzle' },
    53: { icon: '🌦️', label: 'Drizzle' },
    55: { icon: '🌧️', label: 'Heavy drizzle' },
    61: { icon: '🌦️', label: 'Light rain' },
    63: { icon: '🌧️', label: 'Rain' },
    65: { icon: '🌧️', label: 'Heavy rain' },
    71: { icon: '🌨️', label: 'Light snow' },
    73: { icon: '🌨️', label: 'Snow' },
    75: { icon: '❄️', label: 'Heavy snow' },
    80: { icon: '🌦️', label: 'Rain showers' },
    81: { icon: '🌧️', label: 'Rain showers' },
    82: { icon: '⛈️', label: 'Violent showers' },
    95: { icon: '⛈️', label: 'Thunderstorm' },
    96: { icon: '⛈️', label: 'Thunderstorm w/ hail' },
    99: { icon: '⛈️', label: 'Thunderstorm w/ hail' },
};

function describeCode(code) {
    return WEATHER_CODES[code] || { icon: '🌡️', label: 'Weather unavailable' };
}

function renderDate() {
    const dateEl = document.getElementById('current-date');
    const subEl = document.getElementById('current-date-sub');
    if (!dateEl) return;

    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    if (subEl) {
        subEl.textContent = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        }) + ' • Richmond, VA';
    }
}

async function loadWeather() {
    const container = document.getElementById('weather-widget');
    if (!container) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${RICHMOND_LAT}&longitude=${RICHMOND_LON}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=4`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json();

        const current = describeCode(data.current.weather_code);
        const temp = Math.round(data.current.temperature_2m);

        const days = data.daily.time.slice(1, 4).map((dateStr, i) => {
            const idx = i + 1;
            const info = describeCode(data.daily.weather_code[idx]);
            const label = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
            const hi = Math.round(data.daily.temperature_2m_max[idx]);
            const lo = Math.round(data.daily.temperature_2m_min[idx]);
            return `
                <div class="forecast-day">
                    <span class="fc-label">${label}</span>
                    <span class="fc-icon" aria-hidden="true">${info.icon}</span>
                    <span>${hi}&deg; / ${lo}&deg;</span>
                </div>`;
        }).join('');

        container.innerHTML = `
            <div class="weather-current">
                <span class="weather-icon" aria-hidden="true">${current.icon}</span>
                <div>
                    <div class="weather-temp">${temp}&deg;F</div>
                    <div class="weather-desc">${current.label}</div>
                </div>
            </div>
            <div class="weather-forecast">${days}</div>
        `;
    } catch (err) {
        console.error('Could not load weather:', err);
        container.innerHTML = '<p class="error-msg">Weather data is temporarily unavailable. Please check back later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderDate();
    loadWeather();
});
