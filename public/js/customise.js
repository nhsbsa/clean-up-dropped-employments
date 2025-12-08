document.addEventListener('DOMContentLoaded', () => {
  const formCustom = document.getElementById('table-custom-form');
  if (!formCustom) return;
  formCustom.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    // Get all checkbox inputs in the form
    const checkboxes = formCustom.querySelectorAll('input[name="columns"]');
    checkboxes.forEach(cb => {
      const tableClass = cb.value;
      const tableEls = document.getElementsByClassName(tableClass);
      if (!tableEls) return;

      // Show/hide the table based on whether the checkbox is ticked
      Array.from(tableEls).forEach(el => {
        el.style.display = cb.checked ? '' : 'none';
      });
    });
  });
});
const toggleTableFilter = document.getElementById('filters-toggle-data');
const panelTF = document.getElementById('filters-panel-data');
toggleTableFilter.addEventListener('click', () => {
  const isOpen = panelTF.hasAttribute('hidden') === false;
  if (isOpen) {
    panelTF.setAttribute('hidden', '');
    toggleTableFilter.setAttribute('aria-expanded', 'false');
    toggleTableFilter.textContent = 'Customise data set';
  } else {
    panelTF.removeAttribute('hidden');
    toggleTableFilter.setAttribute('aria-expanded', 'true');
    toggleTableFilter.textContent = 'Hide customisable data';
  }
});//# sourceMappingURL=customise.js.map
