// storage.mjs - ES Module for managing client-side LocalStorage state
const FAVORITES_KEY = 'trailscout_favorites';
const FILTER_KEY = 'trailscout_filter';
const LAST_VISIT_KEY = 'trailscout_last_visit';

/**
 * Retrieve the list of favorited trail IDs from localStorage
 * @returns {string[]} Array of trail IDs
 */
export function getFavorites() {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error reading favorites from localStorage:', e);
        return [];
    }
}

/**
 * Check if a trail is currently marked as favorite
 * @param {string} trailId 
 * @returns {boolean}
 */
export function isFavorite(trailId) {
    const favorites = getFavorites();
    return favorites.includes(trailId);
}

/**
 * Toggle a trail ID in the favorites list
 * @param {string} trailId 
 * @returns {boolean} True if now favorited, false if removed
 */
export function toggleFavorite(trailId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(trailId);
    let isNowFav = false;

    if (index >= 0) {
        favorites.splice(index, 1);
        isNowFav = false;
    } else {
        favorites.push(trailId);
        isNowFav = true;
    }

    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.error('Error saving favorites to localStorage:', e);
    }

    return isNowFav;
}

/**
 * Save user's last selected difficulty filter
 * @param {string} filter 
 */
export function saveFilter(filter) {
    try {
        localStorage.setItem(FILTER_KEY, filter);
    } catch (e) {
        console.error('Error saving filter preference:', e);
    }
}

/**
 * Get user's saved difficulty filter
 * @returns {string} Saved filter or 'All'
 */
export function getSavedFilter() {
    return localStorage.getItem(FILTER_KEY) || 'All';
}

/**
 * Track and return visit status for user feedback
 * @returns {string} Status message
 */
export function trackVisit() {
    const now = Date.now();
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const msPerDay = 86400000;
    let message = '';

    if (!lastVisit) {
        message = 'Welcome to TrailScout Virginia! Start exploring scenic trails today.';
    } else {
        const days = Math.floor((now - parseInt(lastVisit, 10)) / msPerDay);
        if (days < 1) {
            message = 'Welcome back today! Ready for another Virginia adventure?';
        } else if (days === 1) {
            message = 'Welcome back! You last explored trails 1 day ago.';
        } else {
            message = `Welcome back! You last visited ${days} days ago.`;
        }
    }

    try {
        localStorage.setItem(LAST_VISIT_KEY, now.toString());
    } catch (e) {
        console.error('Error updating visit timestamp:', e);
    }

    return message;
}
