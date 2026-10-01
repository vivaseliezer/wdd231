// Visitor tracking using localStorage for WDD 231 Chamber Discover Page
document.addEventListener('DOMContentLoaded', () => {
    const visitsDisplay = document.getElementById('visits-message') || document.getElementById('visit-message');
    const closeBtn = document.getElementById('close-visits-btn');
    const banner = document.getElementById('visits-banner');

    if (!visitsDisplay) return;

    const msPerDay = 86400000; // 24 * 60 * 60 * 1000
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit') || localStorage.getItem('chamberLastVisit');

    if (!lastVisit) {
        // First visit
        visitsDisplay.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
        const timeDiff = now - parseInt(lastVisit, 10);
        const daysDiff = Math.floor(timeDiff / msPerDay);

        if (daysDiff < 1) {
            // Less than a day
            visitsDisplay.textContent = 'Back so soon! Awesome!';
        } else if (daysDiff === 1) {
            // Exactly 1 day
            visitsDisplay.textContent = 'You last visited 1 day ago.';
        } else {
            // More than 1 day
            visitsDisplay.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }

    // Update localStorage with current visit timestamp
    localStorage.setItem('lastVisit', now.toString());
    localStorage.setItem('chamberLastVisit', now.toString());

    // Allow user to close/dismiss the banner
    if (closeBtn && banner) {
        closeBtn.addEventListener('click', () => {
            banner.style.display = 'none';
        });
    }
});
