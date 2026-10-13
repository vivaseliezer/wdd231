// trails.js - ES Module script for Trails Directory page
import { fetchTrails } from './api.mjs';
import { getFavorites, toggleFavorite, isFavorite, getSavedFilter, saveFilter } from './storage.mjs';
import { initModal, openTrailModal } from './modal.mjs';

let allTrails = [];
let currentFilter = 'All';
let currentSearch = '';
let showFavoritesOnly = false;
let currentView = 'grid';

function createTrailCard(trail, isFav) {
    const chipClass = trail.difficulty === 'Easy' ? 'chip-easy' : (trail.difficulty === 'Moderate' ? 'chip-mod' : 'chip-stren');
    const heartIcon = isFav ? '❤️' : '🤍';
    const favLabel = isFav ? 'Remove from favorites' : 'Save to favorites';

    return `
        <article class="trail-panel" data-id="${trail.id}" data-difficulty="${trail.difficulty}">
            <div class="trail-image-wrap">
                <img src="${trail.imageUrl}" alt="${trail.imageAlt}" width="300" height="200" loading="lazy" class="trail-card-img">
                <button type="button" class="btn-fav" data-id="${trail.id}" aria-label="${favLabel} for ${trail.name}" title="${favLabel}">
                    <span aria-hidden="true">${heartIcon}</span>
                </button>
                <span class="chip ${chipClass} trail-chip-badge">${trail.difficulty}</span>
            </div>
            <div class="trail-details">
                <div>
                    <p class="trail-region">📍 ${trail.region}</p>
                    <h3 class="trail-name">${trail.name}</h3>
                </div>
                <div class="trail-metrics">
                    <span>📏 <strong>${trail.distanceMiles}</strong> mi</span>
                    <span>⛰️ <strong>${trail.elevationGainFt}</strong> ft</span>
                    <span>⭐ <strong>${trail.rating}</strong></span>
                </div>
                <p class="trail-desc">${trail.description}</p>
                <div class="trail-actions">
                    <button type="button" class="action-btn btn-details" data-id="${trail.id}">
                        View Details
                    </button>
                    <a href="planner.html?trail=${trail.id}" class="outline-btn btn-plan">
                        Plan Hike
                    </a>
                </div>
            </div>
        </article>
    `;
}

function applyFiltersAndRender() {
    const container = document.getElementById('trails-container');
    const resultCountEl = document.getElementById('trails-count');
    if (!container) return;

    const favorites = getFavorites();

    let filtered = allTrails.filter(trail => {
        const matchesDiff = currentFilter === 'All' || trail.difficulty.toLowerCase() === currentFilter.toLowerCase();
        
        const query = currentSearch.toLowerCase().trim();
        const matchesQuery = query === '' ||
            trail.name.toLowerCase().includes(query) ||
            trail.region.toLowerCase().includes(query) ||
            trail.category.toLowerCase().includes(query) ||
            trail.description.toLowerCase().includes(query);

        const matchesFav = !showFavoritesOnly || favorites.includes(trail.id);

        return matchesDiff && matchesQuery && matchesFav;
    });

    if (resultCountEl) {
        resultCountEl.textContent = `Showing ${filtered.length} of ${allTrails.length} Virginia trails`;
    }

    if (filtered.length === 0) {
        container.className = 'trails-empty-state';
        container.innerHTML = `
            <div class="guide-panel" style="text-align:center;">
                <h3>No trails match your search</h3>
                <p>Try resetting your search query or selecting a different difficulty filter.</p>
                <button type="button" id="btn-reset-filters" class="action-btn">Reset Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById('btn-reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                currentFilter = 'All';
                currentSearch = '';
                showFavoritesOnly = false;
                const searchInput = document.getElementById('trail-search-input');
                if (searchInput) searchInput.value = '';
                updateFilterButtons();
                applyFiltersAndRender();
            });
        }
        return;
    }

    container.className = currentView === 'list' ? 'trails-list-view' : 'trails-grid-view';

    const cardsHtml = filtered.map(trail => {
        const isFav = favorites.includes(trail.id);
        return createTrailCard(trail, isFav);
    }).join('');

    container.innerHTML = cardsHtml;
    attachCardEventListeners(container);
    updateSummaryStats(filtered);
}

function updateSummaryStats(trails) {
    const statsContainer = document.getElementById('trail-stats-summary');
    if (!statsContainer || trails.length === 0) return;

    const totalMiles = trails.reduce((acc, t) => acc + t.distanceMiles, 0).toFixed(1);
    const avgElevation = Math.round(trails.reduce((acc, t) => acc + t.elevationGainFt, 0) / trails.length);

    statsContainer.innerHTML = `
        <div class="summary-pill"><span>Total Miles:</span> <strong>${totalMiles} mi</strong></div>
        <div class="summary-pill"><span>Avg. Elevation Gain:</span> <strong>${avgElevation} ft</strong></div>
        <div class="summary-pill"><span>Active Trails:</span> <strong>${trails.length}</strong></div>
    `;
}

function attachCardEventListeners(container) {
    const detailButtons = container.querySelectorAll('.btn-details');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const trailId = btn.getAttribute('data-id');
            const trail = allTrails.find(t => t.id === trailId);
            if (trail) {
                openTrailModal(trail);
            }
        });
    });

    const favButtons = container.querySelectorAll('.btn-fav');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trailId = btn.getAttribute('data-id');
            const isNowFav = toggleFavorite(trailId);
            
            const heartSpan = btn.querySelector('span');
            if (heartSpan) {
                heartSpan.textContent = isNowFav ? '❤️' : '🤍';
            }
            btn.setAttribute('aria-label', isNowFav ? 'Remove from favorites' : 'Save to favorites');

            updateFavoritesCounter();

            if (showFavoritesOnly) {
                applyFiltersAndRender();
            }
        });
    });
}

function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const filterVal = btn.getAttribute('data-filter');
        if (filterVal === currentFilter) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });

    const favToggleBtn = document.getElementById('fav-toggle-btn');
    if (favToggleBtn) {
        if (showFavoritesOnly) {
            favToggleBtn.classList.add('active');
            favToggleBtn.setAttribute('aria-pressed', 'true');
        } else {
            favToggleBtn.classList.remove('active');
            favToggleBtn.setAttribute('aria-pressed', 'false');
        }
    }
}

function updateFavoritesCounter() {
    const favCountBadge = document.getElementById('fav-count-badge');
    if (favCountBadge) {
        const count = getFavorites().length;
        favCountBadge.textContent = count.toString();
    }
}

function setupViewSwitcher() {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    if (!gridBtn || !listBtn) return;

    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        gridBtn.classList.add('active');
        gridBtn.setAttribute('aria-pressed', 'true');
        listBtn.classList.remove('active');
        listBtn.setAttribute('aria-pressed', 'false');
        applyFiltersAndRender();
    });

    listBtn.addEventListener('click', () => {
        currentView = 'list';
        listBtn.classList.add('active');
        listBtn.setAttribute('aria-pressed', 'true');
        gridBtn.classList.remove('active');
        gridBtn.setAttribute('aria-pressed', 'false');
        applyFiltersAndRender();
    });
}

function setupControlEventListeners() {
    const searchInput = document.getElementById('trail-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            applyFiltersAndRender();
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            saveFilter(currentFilter);
            updateFilterButtons();
            applyFiltersAndRender();
        });
    });

    const favToggleBtn = document.getElementById('fav-toggle-btn');
    if (favToggleBtn) {
        favToggleBtn.addEventListener('click', () => {
            showFavoritesOnly = !showFavoritesOnly;
            updateFilterButtons();
            applyFiltersAndRender();
        });
    }

    setupViewSwitcher();
}

async function initTrailsDirectory() {
    initModal();
    setupControlEventListeners();
    updateFavoritesCounter();

    currentFilter = getSavedFilter();
    updateFilterButtons();

    const container = document.getElementById('trails-container');

    try {
        allTrails = await fetchTrails('data/trails.json');

        const urlParams = new URLSearchParams(window.location.search);
        const autoTrailId = urlParams.get('open');
        if (autoTrailId) {
            const targetTrail = allTrails.find(t => t.id === autoTrailId);
            if (targetTrail) {
                openTrailModal(targetTrail);
            }
        }

        applyFiltersAndRender();
    } catch (error) {
        console.error('Failed to load trails data:', error);
        if (container) {
            container.innerHTML = `
                <div class="guide-panel" style="text-align:center;">
                    <h3>Error Loading Trails</h3>
                    <p>We encountered an issue retrieving the trail catalog. Please check your connection and refresh.</p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', initTrailsDirectory);
