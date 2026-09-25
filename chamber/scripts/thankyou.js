// Thank You Page: Reads GET query parameters and displays submitted application details

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Helper to get value matching multiple possible keys
    const getValue = (...keys) => {
        for (const key of keys) {
            const val = params.get(key);
            if (val && val.trim() !== '') {
                return val.trim();
            }
        }
        return null;
    };

    // Extract fields
    const fname = getValue('fname', 'firstname');
    const lname = getValue('lname', 'lastname');
    const orgtitle = getValue('orgtitle', 'title');
    const email = getValue('email');
    const phone = getValue('phone', 'tel');
    const orgname = getValue('organization', 'orgname');
    const membership = getValue('membership', 'level');
    const description = getValue('description', 'orgdesc');
    const timestamp = getValue('timestamp');

    // Populate Greeting
    const greetingEl = document.getElementById('ty-greeting-name');
    if (greetingEl) {
        if (fname && lname) {
            greetingEl.textContent = `${fname} ${lname}`;
        } else if (fname) {
            greetingEl.textContent = fname;
        } else {
            greetingEl.textContent = 'Valued Applicant';
        }
    }

    // Set field text helper
    const setField = (id, value, fallback = '—') => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value || fallback;
        }
    };

    // Format membership tier display
    const formatMembership = (level) => {
        if (!level) return '—';
        const normalized = level.toLowerCase();
        if (normalized === 'np' || normalized.includes('non-profit') || normalized.includes('non profit')) {
            return 'NP Membership — Non-Profit (Free)';
        }
        if (normalized === 'bronze') {
            return 'Bronze Membership — $75 / year';
        }
        if (normalized === 'silver') {
            return 'Silver Membership — $150 / year';
        }
        if (normalized === 'gold') {
            return 'Gold Membership — $300 / year';
        }
        return level;
    };

    // Format timestamp display
    const formatTimestamp = (raw) => {
        if (!raw) return '—';
        const parsed = Date.parse(raw);
        if (!Number.isNaN(parsed)) {
            const d = new Date(parsed);
            return `${d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return raw;
    };

    // Populate all table values
    setField('ty-firstname', fname);
    setField('ty-lastname', lname);
    setField('ty-orgtitle', orgtitle);
    setField('ty-email', email);
    setField('ty-phone', phone);
    setField('ty-orgname', orgname);
    setField('ty-membership', formatMembership(membership));
    setField('ty-description', description);
    setField('ty-timestamp', formatTimestamp(timestamp));
});
