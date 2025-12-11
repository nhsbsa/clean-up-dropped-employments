const toggleButton = document.getElementById('filters-toggle');
const panel = document.getElementById('filters-panel');
toggleButton.addEventListener('click', () => {
  const isOpen = panel.hasAttribute('hidden') === false;
  if (isOpen) {
    panel.setAttribute('hidden', '');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.textContent = 'Compare data sets';
  } else {
    panel.removeAttribute('hidden');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.textContent = 'Hide compare';
  }
});
document.getElementById("compare-form").addEventListener("submit", function (e) {
  const checkboxes = document.querySelectorAll(".nhsuk-checkboxes__input:checked");
  const error = document.getElementById("checkboxError");
  const formGroup = document.querySelector(".nhsuk-form-group");
  if (checkboxes.length > 2) {
    e.preventDefault(); // stop form submission
    error.style.display = "block"; // show error message
    formGroup.classList.add("nhsuk-form-group--error"); // highlight form group
  } else {
    error.style.display = "none"; // hide error
    formGroup.classList.remove("nhsuk-form-group--error"); // remove error highlight
  }
});//# sourceMappingURL=compare.js.map
