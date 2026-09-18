// Thank-you page: reads the submitted form values back out of the URL query string.

function initThankYou() {
    const params = new URLSearchParams(window.location.search);

    const fieldMap = {
        firstname: 'ty-firstname',
        lastname: 'ty-lastname',
        email: 'ty-email',
        phone: 'ty-phone',
        orgtitle: 'ty-orgtitle',
        orgname: 'ty-orgname',
        membership: 'ty-membership',
        timestamp: 'ty-timestamp',
    };

    Object.entries(fieldMap).forEach(([param, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const value = params.get(param);
        el.textContent = value ? value : '—';
    });

    const nameEl = document.getElementById('ty-greeting-name');
    if (nameEl) {
        const first = params.get('firstname');
        nameEl.textContent = first ? first : 'there';
    }
}

document.addEventListener('DOMContentLoaded', initThankYou);
