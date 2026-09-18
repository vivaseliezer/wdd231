// Join page: stamps the hidden timestamp field and powers the membership-level info modal.

const LEVEL_INFO = {
    np: {
        title: 'NP Member — Free',
        body: `
            <p>For registered 501(c)(3) non-profit organizations serving the Richmond community.</p>
            <ul>
                <li>Directory listing</li>
                <li>Access to monthly networking events</li>
                <li>Chamber newsletter</li>
            </ul>`,
    },
    bronze: {
        title: 'Bronze Member — $75/yr',
        body: `
            <p>A great starting point for sole proprietors and small local businesses.</p>
            <ul>
                <li>Everything in NP Member</li>
                <li>Business directory profile with logo</li>
                <li>One free event ticket per quarter</li>
            </ul>`,
    },
    silver: {
        title: 'Silver Member — $150/yr',
        body: `
            <p>Ideal for growing businesses that want more visibility.</p>
            <ul>
                <li>Everything in Bronze</li>
                <li>Featured in home page spotlights</li>
                <li>Discounted event sponsorships</li>
            </ul>`,
    },
    gold: {
        title: 'Gold Member — $300/yr',
        body: `
            <p>Our top tier, for businesses that want maximum exposure and influence.</p>
            <ul>
                <li>Everything in Silver</li>
                <li>Priority placement in spotlights and the directory</li>
                <li>Voting rights at the annual Chamber meeting</li>
                <li>Complimentary booth at the annual expo</li>
            </ul>`,
    },
};

function stampTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toString();
    }
}

function setupLevelDialog() {
    const dialog = document.getElementById('level-dialog');
    const dialogTitle = document.getElementById('level-dialog-title');
    const dialogBody = document.getElementById('level-dialog-body');
    const closeBtn = document.getElementById('level-dialog-close');
    const infoButtons = document.querySelectorAll('.level-info-btn');

    if (!dialog) return;

    infoButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const info = LEVEL_INFO[btn.dataset.level];
            if (!info) return;
            dialogTitle.textContent = info.title;
            dialogBody.innerHTML = info.body;
            dialog.showModal();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => dialog.close());
    }

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
}

function initJoinForm() {
    stampTimestamp();
    setupLevelDialog();
}

document.addEventListener('DOMContentLoaded', initJoinForm);
