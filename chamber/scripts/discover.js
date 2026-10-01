// Discover page script: Renders 8 cards from JSON module and tracks visits with localStorage
import items from '../data/items.mjs';

function displayAttractions(attractions) {
    const container = document.getElementById('attractions') || document.getElementById('discover-cards');
    if (!container) return;

    container.innerHTML = '';

    attractions.forEach((item, index) => {
        const card = document.createElement('section');
        card.classList.add('discover-card');
        card.classList.add(`card${index + 1}`);
        card.id = `card${index + 1}`;

        // 1. Title (h2)
        const title = document.createElement('h2');
        title.textContent = item.name;

        // 2. Figure & Image (figure > img)
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.alt || `Photo of ${item.name}`;
        img.width = 300;
        img.height = 200;
        img.loading = 'lazy';
        figure.appendChild(img);

        // 3. Description (p)
        const description = document.createElement('p');
        description.classList.add('card-desc');
        description.textContent = item.description;

        // 4. Address (address)
        const address = document.createElement('address');
        address.textContent = item.address;

        // 5. Button (button titled "Learn More")
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn-learn-more');
        button.textContent = 'Learn More';
        button.setAttribute('aria-label', `Learn more about ${item.name}`);

        // Modal open handler
        button.addEventListener('click', () => {
            openAttractionModal(item);
        });

        // Append elements to card
        card.append(title, figure, description, address, button);

        // Append card to container
        container.appendChild(card);
    });
}

function openAttractionModal(item) {
    const modal = document.getElementById('discover-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalAddress = document.getElementById('modal-address');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtra = document.getElementById('modal-extra');

    if (modal && modalTitle && modalDesc) {
        modalTitle.textContent = item.name;
        if (modalAddress) modalAddress.textContent = item.address;
        modalDesc.textContent = item.description;
        if (modalExtra) modalExtra.textContent = item.learnMore || '';
        modal.showModal();
    }
}

function setupModal() {
    const modal = document.getElementById('discover-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (!modal) return;

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.close();
        });
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
}

function handleVisitMessage() {
    const visitMessageEl = document.getElementById('visit-message') || document.getElementById('visits-message');
    const banner = document.getElementById('visits-banner');
    const closeBtn = document.getElementById('close-visits-btn');

    if (visitMessageEl) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const currentVisit = Date.now();
        const lastVisit = localStorage.getItem('lastVisit') || localStorage.getItem('chamberLastVisit');

        if (!lastVisit) {
            visitMessageEl.textContent = 'Welcome! Let us know if you have any questions.';
        } else {
            const timeDifference = currentVisit - Number(lastVisit);
            const daysDifference = Math.floor(timeDifference / msPerDay);

            if (daysDifference < 1) {
                visitMessageEl.textContent = 'Back so soon! Awesome!';
            } else if (daysDifference === 1) {
                visitMessageEl.textContent = 'You last visited 1 day ago.';
            } else {
                visitMessageEl.textContent = `You last visited ${daysDifference} days ago.`;
            }
        }

        // Save current visit timestamp
        localStorage.setItem('lastVisit', currentVisit.toString());
        localStorage.setItem('chamberLastVisit', currentVisit.toString());
    }

    if (closeBtn && banner) {
        closeBtn.addEventListener('click', () => {
            banner.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleVisitMessage();
    displayAttractions(items);
    setupModal();
});
