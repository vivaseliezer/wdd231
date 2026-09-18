// Randomly selects Gold/Silver members to feature on the Chamber home page.

function levelBadgeClass(level) {
    switch (level) {
        case 'Gold': return 'badge-gold';
        case 'Silver': return 'badge-silver';
        default: return 'badge-member';
    }
}

function spotlightCard(member) {
    const displayUrl = member.website.replace(/^https?:\/\//, '');
    return `
        <div class="spotlight-card">
            <span class="badge ${levelBadgeClass(member.membershipLevel)}">${member.membershipLevel}</span>
            <div class="member-logo-wrap">
                <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="160" height="90">
            </div>
            <div class="member-body">
                <p class="member-category">${member.category}</p>
                <h3 class="member-name">${member.name}</h3>
                <p class="member-tagline">${member.tagline}</p>
                <p class="member-detail">${member.address}</p>
                <p class="member-detail"><a href="tel:${member.phone.replace(/[^\d+]/g, '')}">${member.phone}</a></p>
                <p class="member-detail"><a class="member-link" href="${member.website}" target="_blank" rel="noopener noreferrer">${displayUrl} &rarr;</a></p>
            </div>
        </div>`;
}

async function loadSpotlights() {
    const container = document.getElementById('spotlights-container');
    if (!container) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const members = await response.json();

        // Feature Gold (3) and Silver (2) members only
        const eligible = members.filter((m) => 
            m.membership === 2 || 
            m.membership === 3 || 
            m.membershipLevel === 'Gold' || 
            m.membershipLevel === 'Silver'
        );

        // Shuffle and pick up to 3
        const shuffled = [...eligible].sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, Math.min(3, shuffled.length));

        container.innerHTML = picks.map(spotlightCard).join('');
    } catch (err) {
        console.error('Could not load member spotlights:', err);
        container.innerHTML = '<p class="error-msg">Member spotlights are unavailable right now.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadSpotlights);
