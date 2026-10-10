// api.mjs - ES Module for asynchronous data fetching with try...catch
const DATA_PATH = 'data/trails.json';

/**
 * Asynchronously fetch trails from local JSON data source with robust error handling
 * @param {string} [path] Optional path override
 * @returns {Promise<Array>} Array of trail objects
 */
export async function fetchTrails(path = DATA_PATH) {
    try {
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - Failed to load trail data.`);
        }
        
        const trails = await response.json();
        
        if (!Array.isArray(trails)) {
            throw new Error('Trail data format is invalid: expected an array.');
        }
        
        return trails;
    } catch (error) {
        console.error('fetchTrails error caught:', error.message);
        throw error; // Re-throw to allow caller UI to display user-friendly error message
    }
}
