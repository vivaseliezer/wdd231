// planner.js - ES Module for Trip Planner registration form
import { fetchTrails } from './api.mjs';

async function initPlanner() {
    const trailSelect = document.getElementById('trail-select');
    const dateInput = document.getElementById('hike-date');
    const timestampInput = document.getElementById('submittedAt');
    const form = document.getElementById('trip-planner-form');

    // 1. Set current timestamp in hidden input
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }

    // 2. Set min date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // 3. Populate trails <select> dynamically from data/trails.json
    if (trailSelect) {
        try {
            const trails = await fetchTrails('data/trails.json');
            
            // Populate options with template literals
            const optionsHtml = trails.map(t => 
                `<option value="${t.name}">${t.name} (${t.difficulty} - ${t.region})</option>`
            ).join('');
            
            trailSelect.innerHTML = `
                <option value="" disabled selected>-- Select a Virginia Trail --</option>
                ${optionsHtml}
            `;

            // Check if a trail was passed in URL query parameter (?trail=old-rag)
            const urlParams = new URLSearchParams(window.location.search);
            const preselectedId = urlParams.get('trail');
            if (preselectedId) {
                const targetTrail = trails.find(t => t.id === preselectedId);
                if (targetTrail) {
                    trailSelect.value = targetTrail.name;
                }
            }
        } catch (err) {
            console.error('Could not populate trail dropdown:', err);
            trailSelect.innerHTML = `
                <option value="" disabled>Unable to load trails dynamically</option>
                <option value="Old Rag Mountain Loop">Old Rag Mountain Loop</option>
                <option value="Humpback Rocks Trail">Humpback Rocks Trail</option>
                <option value="Crabtree Falls Loop">Crabtree Falls Loop</option>
            `;
        }
    }

    // 4. Update timestamp right before submission
    if (form) {
        form.addEventListener('submit', () => {
            if (timestampInput) {
                timestampInput.value = new Date().toLocaleString();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initPlanner);
