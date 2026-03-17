const toggleButtonCmp = document.getElementById('compare-toggle');
const panelCmp = document.getElementById('compare-panel');

toggleButtonCmp.addEventListener('click', () => {
    const isOpen = panelCmp.hasAttribute('hidden') === false;

    if (isOpen) {
        panelCmp.setAttribute('hidden', '');
        toggleButtonCmp.setAttribute('aria-expanded', 'false');
        toggleButtonCmp.textContent = 'Compare data sets';
    } else {
        panelCmp.removeAttribute('hidden');
        toggleButtonCmp.setAttribute('aria-expanded', 'true');
        toggleButtonCmp.textContent = 'Hide compare';
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
});
