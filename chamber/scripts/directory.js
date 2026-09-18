// Fetches the member list and renders it in the Directory page, with a Grid / List toggle.

function levelBadgeClass(level) {
    switch (level) {
        case 'Gold': return 'badge-gold';
        case 'Silver': return 'badge-silver';
        default: return 'badge-member';
    }
}

function memberCard(member) {
    return `
        <div class="member-card">
            <span class="badge ${levelBadgeClass(member.membershipLevel)}">${member.membershipLevel}</span>
            <div class="member-logo-wrap">
                <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="160" height="90">
            </div>
            <div class="member-body">
                <div>
                    <p class="member-category">${member.category}</p>
                    <h3 class="member-name">${member.name}</h3>
                </div>
                <p class="member-tagline">${member.tagline}</p>
                <p class="member-detail">${member.address}</p>
                <p class="member-detail"><a href="tel:${member.phone.replace(/[^\d+]/g, '')}">${member.phone}</a></p>
                <a class="member-link" href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website &rarr;</a>
            </div>
        </div>`;
}

function renderDirectory(members, view) {
    const container = document.getElementById('directory-container');
    if (!container) return;
    container.className = view === 'list' ? 'directory-list' : 'directory-grid';
    container.innerHTML = members.map(memberCard).join('');
}

function setActiveButton(activeBtn, otherBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
    otherBtn.classList.remove('active');
    otherBtn.setAttribute('aria-pressed', 'false');
}

function setupViewToggle(members) {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    if (!gridBtn || !listBtn) return;

    gridBtn.addEventListener('click', () => {
        setActiveButton(gridBtn, listBtn);
        renderDirectory(members, 'grid');
    });

    listBtn.addEventListener('click', () => {
        setActiveButton(listBtn, gridBtn);
        renderDirectory(members, 'list');
    });
}

async function loadDirectory() {
    const container = document.getElementById('directory-container');
    if (!container) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const members = await response.json();

        // Sort alphabetically for a predictable directory listing
        members.sort((a, b) => a.name.localeCompare(b.name));

        renderDirectory(members, 'grid');
        setupViewToggle(members);
    } catch (err) {
        console.error('Could not load the member directory:', err);
        container.innerHTML = '<p class="error-msg">The member directory is unavailable right now. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadDirectory);
