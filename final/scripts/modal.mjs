// modal.mjs - ES Module for accessible native <dialog> management

let dialogElement = null;

export function initModal(dialogId = 'trail-modal') {
    dialogElement = document.getElementById(dialogId);
    if (!dialogElement) return;

    const closeBtn = dialogElement.querySelector('.modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    dialogElement.addEventListener('click', (event) => {
        const rect = dialogElement.getBoundingClientRect();
        const isInDialog = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            closeModal();
        }
    });
}

export function openTrailModal(trail) {
    if (!dialogElement) {
        initModal();
    }
    if (!dialogElement) return;

    const modalBody = dialogElement.querySelector('.modal-content-body');
    if (!modalBody) return;

    const chipClass = trail.difficulty === 'Easy' ? 'chip-easy' : (trail.difficulty === 'Moderate' ? 'chip-mod' : 'chip-stren');

    const highlightsHtml = trail.highlights && trail.highlights.length > 0
        ? trail.highlights.map(h => `<li>${h}</li>`).join('')
        : '<li>Scenic Virginia Nature</li>';

    const gearHtml = trail.gearRequired && trail.gearRequired.length > 0
        ? trail.gearRequired.map(g => `<li>${g}</li>`).join('')
        : '<li>Standard Day Hiking Gear</li>';

    modalBody.innerHTML = `
        <div class="modal-header-row">
            <span class="chip ${chipClass}">${trail.difficulty}</span>
            <span class="modal-region">📍 ${trail.region}</span>
            <span class="modal-rating">⭐ ${trail.rating} / 5.0</span>
        </div>
        <h2 id="modal-trail-name" class="modal-title">${trail.name}</h2>
        <div class="modal-stats-grid">
            <div class="modal-stat-box">
                <span class="stat-label">Distance</span>
                <span class="stat-val">${trail.distanceMiles} miles</span>
            </div>
            <div class="modal-stat-box">
                <span class="stat-label">Elevation Gain</span>
                <span class="stat-val">${trail.elevationGainFt} ft</span>
            </div>
            <div class="modal-stat-box">
                <span class="stat-label">Est. Time</span>
                <span class="stat-val">${trail.estimatedTime}</span>
            </div>
            <div class="modal-stat-box">
                <span class="stat-label">Category</span>
                <span class="stat-val">${trail.category}</span>
            </div>
        </div>
        <div class="modal-desc-wrap">
            <h3>Trail Description</h3>
            <p>${trail.description}</p>
        </div>
        <div class="modal-lists-grid">
            <div class="modal-list-col">
                <h3>Highlights</h3>
                <ul class="modal-features-list">
                    ${highlightsHtml}
                </ul>
            </div>
            <div class="modal-list-col">
                <h3>Recommended Gear</h3>
                <ul class="modal-gear-list">
                    ${gearHtml}
                </ul>
            </div>
        </div>
        <div class="modal-safety-note">
            <strong>⚠️ Safety & Ranger Advice:</strong>
            <p>${trail.safetyTip}</p>
        </div>
        <div class="modal-actions-row">
            <a href="planner.html?trail=${trail.id}" class="action-btn">Plan Hike for this Trail &rarr;</a>
        </div>
    `;

    dialogElement.showModal();
}

export function closeModal() {
    if (dialogElement && dialogElement.open) {
        dialogElement.close();
    }
}
