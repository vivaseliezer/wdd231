// trails.js - ES Module script for Trails Directory page
import { fetchTrails } from './api.mjs';
import { getFavorites, toggleFavorite, isFavorite, getSavedFilter, saveFilter } from './storage.mjs';
import { initModal, openTrailModal } from './modal.mjs';

// Application State
let allTrails = [];
let currentFilter = 'All';
let currentSearch = '';
let showFavoritesOnly = false;
let currentView = 'grid'; // 'grid' or 'list'

/**
 * Render a single trail card template literal
 * @param {Object} trail 
 * @param {boolean} isFav 
 * @returns {string} HTML string
 */
function createTrailCard(trail, isFav) {
    const diffClass = `badge-${trail.difficulty.toLowerCase()}`;
    const heartIcon = isFav ? '❤️' : '🤍';
    const favLabel = isFav ? 'Remove from favorites' : 'Save to favorites';

    return `
        <article class="trail-card" data-id="${trail.id}" data-difficulty="${trail.difficulty}">
            <div class="trail-card-image-wrap">
                <img src="${trail.imageUrl}" alt="${trail.imageAlt}" width="300" height="200" loading="lazy" class="trail-card-img">
                <button type="button" class="btn-fav" data-id="${trail.id}" aria-label="${favLabel} for ${trail.name}" title="${favLabel}">
                    <span aria-hidden="true">${heartIcon}</span>
                </button>
                <span class="badge ${diffClass} trail-card-badge">${trail.difficulty}</span>
            </div>
            <div class="trail-card-content">
                <div class="trail-card-header">
                    <p class="trail-region">📍 ${trail.region}</p>
                    <h3 class="trail-name">${trail.name}</h3>
                </div>
                <div class="trail-quick-metrics">
                    <span class="metric" title="Total Distance">📏 <strong>${trail.distanceMiles}</strong> mi</span>
                    <span class="metric" title="Elevation Gain">⛰️ <strong>${trail.elevationGainFt}</strong> ft</span>
                    <span class="metric" title="Hiker Rating">⭐ <strong>${trail.rating}</strong></span>
                </div>
                <p class="trail-desc">${trail.description}</p>
                <div class="trail-card-footer">
                    <button type="button" class="btn-primary btn-view-details" data-id="${trail.id}">
                        View Details
                    </button>
                    <a href="planner.html?trail=${trail.id}" class="btn-secondary btn-plan-hike">
                        Plan Hike
                    </a>
                </div>
            </div>
        </article>
    `;
}

/**
 * Filter and render the trail list according to search, difficulty, and favorites
 */
function applyFiltersAndRender() {
    const container = document.getElementById('trails-container');
    const resultCountEl = document.getElementById('trails-count');
    if (!container) return;

    const favorites = getFavorites();

    // 1. Array Method: filter()
    let filtered = allTrails.filter(trail => {
        // Difficulty filter
        const matchesDiff = currentFilter === 'All' || trail.difficulty.toLowerCase() === currentFilter.toLowerCase();
        
        // Search text query
        const query = currentSearch.toLowerCase().trim();
        const matchesQuery = query === '' ||
            trail.name.toLowerCase().includes(query) ||
            trail.region.toLowerCase().includes(query) ||
            trail.category.toLowerCase().includes(query) ||
            trail.description.toLowerCase().includes(query);

        // Favorites toggle
        const matchesFav = !showFavoritesOnly || favorites.includes(trail.id);

        return matchesDiff && matchesQuery && matchesFav;
    });

    // Update Result Counter
    if (resultCountEl) {
        resultCountEl.textContent = `Showing ${filtered.length} of ${allTrails.length} Virginia trails`;
    }

    // Empty state handling
    if (filtered.length === 0) {
        container.className = 'trails-empty-state';
        container.innerHTML = `
            <div class="empty-message-card">
                <h3>No trails found</h3>
                <p>Try resetting your search query or selecting a different difficulty filter.</p>
                <button type="button" id="btn-reset-filters" class="btn-primary">Reset Filters</button>
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

    // Set layout class
    container.className = currentView === 'list' ? 'trails-list-view' : 'trails-grid-view';

    // 2. Array Method: map() and join() with Template Literals
    const cardsHtml = filtered.map(trail => {
        const isFav = favorites.includes(trail.id);
        return createTrailCard(trail, isFav);
    }).join('');

    // DOM Manipulation: update innerHTML
    container.innerHTML = cardsHtml;

    // Attach event listeners to card interactive elements
    attachCardEventListeners(container);

    // Compute and display summary stats using reduce()
    updateSummaryStats(filtered);
}

/**
 * Use Array reduce() to compute aggregate statistics
 * @param {Array} trails 
 */
function updateSummaryStats(trails) {
    const statsContainer = document.getElementById('trail-stats-summary');
    if (!statsContainer || trails.length === 0) return;

    // Array Method: reduce() to compute total miles
    const totalMiles = trails.reduce((acc, t) => acc + t.distanceMiles, 0).toFixed(1);
    
    // Array Method: reduce() to calculate average elevation gain
    const avgElevation = Math.round(trails.reduce((acc, t) => acc + t.elevationGainFt, 0) / trails.length);

    statsContainer.innerHTML = `
        <div class="summary-pill"><span>Total Miles:</span> <strong>${totalMiles} mi</strong></div>
        <div class="summary-pill"><span>Avg. Elevation Gain:</span> <strong>${avgElevation} ft</strong></div>
        <div class="summary-pill"><span>Active Trails:</span> <strong>${trails.length}</strong></div>
    `;
}

/**
 * Attach click listeners to cards (Favorites and View Details modal trigger)
 * @param {HTMLElement} container 
 */
function attachCardEventListeners(container) {
    // 3. Array Method / NodeList forEach: View Details button triggers modal
    const detailButtons = container.querySelectorAll('.btn-view-details');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const trailId = btn.getAttribute('data-id');
            const trail = allTrails.find(t => t.id === trailId);
            if (trail) {
                openTrailModal(trail);
            }
        });
    });

    // Favorites button toggle
    const favButtons = container.querySelectorAll('.btn-fav');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trailId = btn.getAttribute('data-id');
            const isNowFav = toggleFavorite(trailId);
            
            // Visual DOM update
            const heartSpan = btn.querySelector('span');
            if (heartSpan) {
                heartSpan.textContent = isNowFav ? '❤️' : '🤍';
            }
            btn.setAttribute('aria-label', isNowFav ? 'Remove from favorites' : 'Save to favorites');

            // Update favorites counter pill
            updateFavoritesCounter();

            // If we are currently in favorites-only mode, re-render
            if (showFavoritesOnly) {
                applyFiltersAndRender();
            }
        });
    });
}

/**
 * Update active state on filter buttons
 */
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

/**
 * Update favorites count display
 */
function updateFavoritesCounter() {
    const favCountBadge = document.getElementById('fav-count-badge');
    if (favCountBadge) {
        const count = getFavorites().length;
        favCountBadge.textContent = count.toString();
    }
}

/**
 * Setup view switcher (Grid / List)
 */
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

/**
 * Initialize event listeners for controls (search, filter buttons, fav toggle)
 */
function setupControlEventListeners() {
    // Search input with debounce or direct input
    const searchInput = document.getElementById('trail-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            applyFiltersAndRender();
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            saveFilter(currentFilter);
            updateFilterButtons();
            applyFiltersAndRender();
        });
    });

    // Favorites only toggle button
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

/**
 * Main initialization entry point using async/await with try...catch
 */
async function initTrailsDirectory() {
    initModal();
    setupControlEventListeners();
    updateFavoritesCounter();

    // Restore saved difficulty filter from localStorage
    currentFilter = getSavedFilter();
    updateFilterButtons();

    const container = document.getElementById('trails-container');

    try {
        // Asynchronous data fetching
        allTrails = await fetchTrails('data/trails.json');

        // Check if a specific trail was requested via URL param (e.g. from index or modal)
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
                <div class="trails-error-message">
                    <h3>Error Loading Trails</h3>
                    <p>We encountered an issue retrieving the trail catalog. Please check your connection and refresh.</p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', initTrailsDirectory);
