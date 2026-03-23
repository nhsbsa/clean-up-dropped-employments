document.getElementById("compare-form").addEventListener("submit", function (e) {
    const checkboxes = document.querySelectorAll(".compare-checkboxes__input:checked");
    const error = document.getElementById("checkboxError");
    const formGroup = document.querySelector(".compareGroup");

    if (checkboxes.length > 2) {
        e.preventDefault(); // stop form submission
        error.style.display = "block"; // show error message
        formGroup.classList.add("nhsuk-form-group--error"); // highlight form group
    } else {
        error.style.display = "none"; // hide error
        formGroup.classList.remove("nhsuk-form-group--error"); // remove error highlight
    }
});


