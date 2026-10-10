// main.js - Shared script for TrailScout Virginia (Nav toggle, Wayfinding, Footer dates)

function initGlobalComponents() {
    // 1. Dynamic Copyright Year
    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Dynamic Last Modified Date
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // 3. Mobile Navigation Menu Toggle with Accessibility
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen.toString());
            navToggle.textContent = isOpen ? '✕' : '☰';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = '☰';
            }
        });

        // Close mobile menu on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = '☰';
                navToggle.focus();
            }
        });
    }

    // 4. Wayfinding: highlight current active page in navigation
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href').toLowerCase();
        // Check exact match or trailing file name match
        const isMatch = (
            (currentPath.endsWith(href) || currentPath.endsWith(href.replace('./', ''))) ||
            (href === 'index.html' && (currentPath.endsWith('/final/') || currentPath.endsWith('/final')))
        );
        if (isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalComponents);
} else {
    initGlobalComponents();
}
