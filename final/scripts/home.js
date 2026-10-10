// home.js - ES Module script for TrailScout Virginia home page
import { fetchTrails } from './api.mjs';
import { trackVisit } from './storage.mjs';
import { initModal, openTrailModal } from './modal.mjs';

/**
 * Render featured trail cards on the home page
 * @param {Array} trails 
 */
function renderFeaturedTrails(trails) {
    const container = document.getElementById('featured-trails-grid');
    if (!container) return;

    // Pick 3 highlighted trails: Old Rag, Humpback Rocks, Crabtree Falls
    const featuredIds = ['old-rag', 'humpback-rocks', 'crabtree-falls'];
    const featuredList = trails.filter(t => featuredIds.includes(t.id));

    container.innerHTML = featuredList.map(trail => {
        const diffClass = `badge-${trail.difficulty.toLowerCase()}`;
        return `
            <article class="featured-card">
                <div class="featured-img-wrap">
                    <img src="${trail.imageUrl}" alt="${trail.imageAlt}" width="300" height="200" loading="lazy" class="featured-img">
                    <span class="badge ${diffClass} featured-badge">${trail.difficulty}</span>
                </div>
                <div class="featured-card-body">
                    <p class="featured-region">📍 ${trail.region}</p>
                    <h3 class="featured-title">${trail.name}</h3>
                    <div class="featured-metrics">
                        <span>📏 <strong>${trail.distanceMiles}</strong> mi</span>
                        <span>⛰️ <strong>${trail.elevationGainFt}</strong> ft elev</span>
                        <span>⭐ <strong>${trail.rating}</strong></span>
                    </div>
                    <p class="featured-desc">${trail.description}</p>
                    <div class="featured-card-actions">
                        <button type="button" class="btn-primary btn-view-feat" data-id="${trail.id}">
                            View Details
                        </button>
                        <a href="planner.html?trail=${trail.id}" class="btn-secondary">
                            Plan Hike
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Attach modal trigger listeners
    const modalButtons = container.querySelectorAll('.btn-view-feat');
    modalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const trailId = btn.getAttribute('data-id');
            const trail = trails.find(t => t.id === trailId);
            if (trail) {
                openTrailModal(trail);
            }
        });
    });
}

/**
 * Display dynamic visitor greeting tracked in localStorage
 */
function renderVisitorGreeting() {
    const greetingEl = document.getElementById('visitor-greeting-message');
    const greetingBanner = document.getElementById('visitor-banner');
    const closeBtn = document.getElementById('btn-close-banner');

    if (greetingEl && greetingBanner) {
        const message = trackVisit();
        greetingEl.textContent = message;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                greetingBanner.style.display = 'none';
            });
        }
    }
}

/**
 * Initialize Home Page
 */
async function initHome() {
    initModal();
    renderVisitorGreeting();

    try {
        const trails = await fetchTrails('data/trails.json');
        renderFeaturedTrails(trails);
    } catch (err) {
        console.error('Error loading featured trails:', err);
        const container = document.getElementById('featured-trails-grid');
        if (container) {
            container.innerHTML = '<p class="error-msg">Featured trails could not be loaded at this time.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', initHome);
