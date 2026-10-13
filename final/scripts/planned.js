// planned.js - Form Action Page: Reads URLSearchParams and renders submitted hike registration
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('confirmation-card-wrap');
    if (!container) return;

    const getVal = (key, fallback = '—') => {
        const val = params.get(key);
        return val && val.trim() !== '' ? val.trim() : fallback;
    };

    const hikerName = getVal('hikerName', '');
    const email = getVal('email');
    const phone = getVal('phone');
    const trail = getVal('trail');
    const hikeDate = getVal('hikeDate');
    const partySize = getVal('partySize');
    const experience = getVal('experience');
    const emergencyContact = getVal('emergencyContact');
    const notes = getVal('notes', 'None provided');
    const submittedAt = getVal('submittedAt', new Date().toLocaleDateString());

    const gearList = params.getAll('gear');
    const gearDisplay = gearList.length > 0 
        ? gearList.map(g => `<span class="gear-tag">✓ ${g}</span>`).join(' ') 
        : '<em>No specific gear selected</em>';

    if (!hikerName && trail === '—') {
        container.innerHTML = `
            <div class="form-panel" style="text-align:center;">
                <h3>No Hike Registration Data Found</h3>
                <p>It looks like you reached this page directly without submitting a trail trip plan.</p>
                <a href="planner.html" class="action-btn">Go to Trip Planner &rarr;</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="permit-panel">
            <div style="text-align:center; border-bottom:2px dashed var(--color-border); padding-bottom:1.25rem; margin-bottom:1.5rem;">
                <span class="chip chip-mod" style="font-size:0.8rem; margin-bottom:0.5rem;">OFFICIAL REGISTRATION</span>
                <h3 style="margin:0.25rem 0 0.5rem 0; font-size:1.6rem;">Trail Trip Confirmation & Safety Permit</h3>
                <p style="color:var(--color-text-muted); margin:0;">Thank you, <strong>${hikerName}</strong>! Your Virginia hike itinerary has been recorded.</p>
            </div>

            <div class="permit-grid">
                <div class="permit-item">
                    <strong class="stat-label">Primary Hiker</strong>
                    <span class="stat-val">${hikerName}</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Selected Trail</strong>
                    <span class="stat-val" style="color:var(--color-primary);">${trail}</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Scheduled Hike Date</strong>
                    <span class="stat-val">${hikeDate}</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Party Size</strong>
                    <span class="stat-val">${partySize} hikers</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Experience Level</strong>
                    <span class="stat-val">${experience}</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Contact Email</strong>
                    <span class="stat-val">${email}</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Contact Phone</strong>
                    <span class="stat-val">${phone}</span>
                </div>
                <div class="permit-item">
                    <strong class="stat-label">Emergency Contact</strong>
                    <span class="stat-val">${emergencyContact}</span>
                </div>
            </div>

            <div style="margin-bottom:1.5rem;">
                <h3 style="font-size:1.1rem; margin-bottom:0.5rem;">Gear Checklist Confirmed</h3>
                <div>${gearDisplay}</div>
            </div>

            <div style="margin-bottom:1.5rem;">
                <h3 style="font-size:1.1rem; margin-bottom:0.5rem;">Hiker Notes & Dietary / Medical Considerations</h3>
                <p class="permit-notes">${notes}</p>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border-subtle); padding-top:1.25rem; flex-wrap:wrap; gap:1rem;">
                <p style="font-size:0.85rem; color:var(--color-text-muted); margin:0;">Registered on: <strong>${submittedAt}</strong></p>
                <div style="display:flex; gap:0.75rem;">
                    <button type="button" class="action-btn" onclick="window.print()">Print Itinerary</button>
                    <a href="trails.html" class="outline-btn">Explore More Trails</a>
                </div>
            </div>
        </div>
    `;
});
