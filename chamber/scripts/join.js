// Join Page: Stamps hidden timestamp and powers the 4 membership level dialog modals

document.addEventListener('DOMContentLoaded', () => {
    // 1. Stamp current date/time into hidden timestamp field
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // 2. Setup 4 Membership Level Modals
    const openButtons = document.querySelectorAll('.btn-modal-open');
    const modals = document.querySelectorAll('dialog.level-modal');

    // Open corresponding modal when card button is clicked
    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal && typeof targetModal.showModal === 'function') {
                targetModal.showModal();
            }
        });
    });

    // Close modal when close button is clicked
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    closeButtons.forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            const parentModal = closeBtn.closest('dialog');
            if (parentModal) {
                parentModal.close();
            }
        });
    });

    // Close modal when clicking on the backdrop
    modals.forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    });
});
