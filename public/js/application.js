document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('table-selector-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = form.querySelectorAll('input[name="tables"]');
    checkboxes.forEach(cb => {
      const tableId = cb.value;
      const tableEl = document.getElementById(tableId);
      if (!tableEl) return;

      // Show/hide the table based on whether the checkbox is ticked
      tableEl.style.display = cb.checked ? '' : 'none';
    });
  });
});
const toggleButton = document.getElementById('filters-toggle');
const panel = document.getElementById('filters-panel');
toggleButton.addEventListener('click', () => {
  const isOpen = panel.hasAttribute('hidden') === false;
  if (isOpen) {
    panel.setAttribute('hidden', '');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.textContent = 'Show filters';
  } else {
    panel.removeAttribute('hidden');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.textContent = 'Hide filters';
  }
});//# sourceMappingURL=application.js.map
