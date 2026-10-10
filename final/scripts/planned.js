// planned.js - Form Action Page: Reads URLSearchParams and renders submitted hike registration
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('confirmation-card-wrap');
    if (!container) return;

    // Helper to safely extract parameter value
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

    // Extract multiple checkboxes for gear using getAll()
    const gearList = params.getAll('gear');
    const gearDisplay = gearList.length > 0 
        ? gearList.map(g => `<span class="gear-tag">✓ ${g}</span>`).join(' ') 
        : '<em>No specific gear selected</em>';

    // If no hikerName or trail provided, show empty fallback
    if (!hikerName && trail === '—') {
        container.innerHTML = `
            <div class="empty-confirmation-card">
                <h2>No Hike Registration Data Found</h2>
                <p>It looks like you reached this page directly without submitting a trail trip plan.</p>
                <a href="planner.html" class="btn-primary">Go to Trip Planner &rarr;</a>
            </div>
        `;
        return;
    }

    // Render Confirmation Card using template literals
    container.innerHTML = `
        <div class="permit-card">
            <div class="permit-header">
                <div class="permit-stamp">OFFICIAL REGISTRATION</div>
                <h2>Trail Trip Confirmation & Safety Permit</h2>
                <p class="permit-subtitle">Thank you, <strong>${hikerName}</strong>! Your Virginia hike itinerary has been recorded.</p>
            </div>

            <div class="permit-grid">
                <div class="permit-field">
                    <span class="field-label">Primary Hiker</span>
                    <span class="field-value">${hikerName}</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Selected Trail</span>
                    <span class="field-value highlight-trail">${trail}</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Scheduled Hike Date</span>
                    <span class="field-value">${hikeDate}</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Party Size</span>
                    <span class="field-value">${partySize} hikers</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Experience Level</span>
                    <span class="field-value">${experience}</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Contact Email</span>
                    <span class="field-value">${email}</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Contact Phone</span>
                    <span class="field-value">${phone}</span>
                </div>
                <div class="permit-field">
                    <span class="field-label">Emergency Contact</span>
                    <span class="field-value">${emergencyContact}</span>
                </div>
            </div>

            <div class="permit-section">
                <h3>Gear Checklist Confirmed</h3>
                <div class="gear-tags-wrap">
                    ${gearDisplay}
                </div>
            </div>

            <div class="permit-section">
                <h3>Hiker Notes & Dietary / Medical Considerations</h3>
                <p class="permit-notes">${notes}</p>
            </div>

            <div class="permit-footer">
                <p class="submitted-timestamp">Registered on: <strong>${submittedAt}</strong></p>
                <div class="permit-actions">
                    <button type="button" class="btn-primary" onclick="window.print()">Print Itinerary</button>
                    <a href="trails.html" class="btn-secondary">Explore More Trails</a>
                </div>
            </div>
        </div>
    `;
});
