// home.js - ES Module script for TrailScout Virginia home page
import { fetchTrails } from './api.mjs';
import { trackVisit } from './storage.mjs';
import { initModal, openTrailModal } from './modal.mjs';

function renderFeaturedTrails(trails) {
    const container = document.getElementById('featured-trails-grid');
    if (!container) return;

    const featuredIds = ['old-rag', 'humpback-rocks', 'crabtree-falls'];
    const featuredList = trails.filter(t => featuredIds.includes(t.id));

    container.innerHTML = featuredList.map(trail => {
        const chipClass = trail.difficulty === 'Easy' ? 'chip-easy' : (trail.difficulty === 'Moderate' ? 'chip-mod' : 'chip-stren');
        return `
            <article class="trail-panel">
                <div class="trail-image-wrap">
                    <img src="${trail.imageUrl}" alt="${trail.imageAlt}" width="300" height="200" loading="lazy" class="trail-card-img">
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
                        <button type="button" class="action-btn btn-view-feat" data-id="${trail.id}">
                            View Details
                        </button>
                        <a href="planner.html?trail=${trail.id}" class="outline-btn">
                            Plan Hike
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

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
