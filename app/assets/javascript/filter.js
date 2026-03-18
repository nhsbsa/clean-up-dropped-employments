document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('table-selector-form')

    if (!form) return

    form.addEventListener('submit', function (e) {
        e.preventDefault() // prevent page reload

        // Get all checkbox inputs in the form
        const checkboxes = form.querySelectorAll('input[name="tables"]')

        checkboxes.forEach(cb => {
            const tableId = cb.value
            const tableEl = document.getElementById(tableId)

            if (!tableEl) return

            // Show/hide the table based on whether the checkbox is ticked
            tableEl.style.display = cb.checked ? '' : 'none'
        })
    })

})

const toggleFilter = document.getElementById('filters-toggle');
const panelFilter = document.getElementById('filters-panel');

toggleFilter.addEventListener('click', () => {
    const isOpen = panelFilter.hasAttribute('hidden') === false;

    if (isOpen) {
        panelFilter.setAttribute('hidden', '');
        toggleFilter.setAttribute('aria-expanded', 'false');
        toggleFilter.textContent = 'Show filters';
    } else {
        panelFilter.removeAttribute('hidden');
        toggleFilter.setAttribute('aria-expanded', 'true');
        toggleFilter.textContent = 'Hide filters';
    }
});
