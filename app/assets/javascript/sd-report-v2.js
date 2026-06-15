document.addEventListener('DOMContentLoaded', function () {

    const tableBody = document.querySelector('#reportTable tbody');
    const addButton = document.getElementById('addRowButton');

    // Remove row
    function bindRemoveLinks() {
        tableBody.querySelectorAll('.remove-row').forEach(link => {
            link.removeEventListener('click', removeHandler);
            link.addEventListener('click', removeHandler);
        });
    }

    function removeHandler(e) {
        e.preventDefault();
        const row = e.target.closest('tr');
        row.remove();
    }

    bindRemoveLinks();

    // Add new row
    addButton.addEventListener('click', function () {

        const rowCount = tableBody.querySelectorAll('tr').length + 1;

        const newRow = document.createElement('tr');
        newRow.classList.add('nhsuk-table__row');

        newRow.innerHTML = `
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="sets-${rowCount}"
                    name="sets[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="fields-${rowCount}"
                    name="fields[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell">
            <input class="nhsuk-input nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"
                    type="text">
        </td>
    
        <td class="nhsuk-table__cell  nhsuk-u-font-size-14">
        <a href="#" class="remove-row nhsuk-link">
            Remove
            <span class="nhsuk-u-visually-hidden">row ${rowCount}</span>
        </a>
        </td>
    `;

        tableBody.appendChild(newRow);
        bindRemoveLinks();
    });

    const form = document.getElementById("reportForm");
    const errorSummary = document.getElementById("errorSummary");
    const errorList = document.getElementById("errorList");

    const table = document.getElementById("reportTable");

    const fields = ["sets[]", "fields[]", "amendments[]", "reason[]"];

    // =========================
    // SUBMIT VALIDATION
    // =========================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        clearErrors();

        let errors = [];
        let firstErrorField = null;

        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((row, rowIndex) => {
            const inputs = getRowInputs(row);

            const rowHasData = inputs.some(i => i.value.trim() !== "");

            // ignore empty rows completely
            if (!rowHasData) return;

            inputs.forEach((input, colIndex) => {
                const message = getErrorMessage(colIndex);

                if (!input.value.trim()) {
                    const errorId = ensureError(input, message, rowIndex);

                    errors.push(
                        `<li><a href="#${errorId}">${message} (row ${rowIndex + 1})</a></li>`
                    );

                    if (!firstErrorField) {
                        firstErrorField = input;
                    }
                }
            });
        });

        if (errors.length > 0) {
            errorList.innerHTML = errors.join("");
            errorSummary.style.display = "block";

            errorSummary.scrollIntoView({ behavior: "smooth" });

            if (firstErrorField) {
                setTimeout(() => {
                    firstErrorField.focus();
                    firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 200);
            }

            return;
        }

        form.submit();
    });

    // =========================
    // LIVE VALIDATION (on input)
    // =========================
    table.addEventListener("input", function (e) {
        const input = e.target;

        if (!input.matches("input")) return;

        const cell = input.closest("td");

        if (input.value.trim()) {
            removeError(input, cell);
        }
    });

    // =========================
    // HELPERS
    // =========================

    function getRowInputs(row) {
        return [
            row.querySelector('input[name="sets[]"]'),
            row.querySelector('input[name="fields[]"]'),
            row.querySelector('input[name="amendments[]"]'),
        ];
    }

    function getErrorMessage(index) {
        switch (index) {
            case 0: 
                return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the set';
            case 1: 
                return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the field';
            case 2: 
                return '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the amendment';
            default: return 'This field is required';
        }
    }

    function ensureError(input, message, rowIndex) {
        const cell = input.closest("td");

        cell.classList.add("nhsuk-form-group--error");

        let error = cell.querySelector(".nhsuk-error-message");

        if (!error) {
            error = document.createElement("span");
            error.className = "nhsuk-error-message nhsuk-u-font-size-14";
            cell.insertBefore(error, input);
        }

        error.innerHTML = message;

        const errorId = input.id || `row-${rowIndex}-${Math.random().toString(36).slice(2, 7)}`;

        input.setAttribute("aria-describedby", errorId);
        input.id = errorId;

        return errorId;
    }

    function clearErrors() {
        errorList.innerHTML = "";
        errorSummary.style.display = "none";

        document.querySelectorAll(".nhsuk-form-group--error")
            .forEach(el => el.classList.remove("nhsuk-form-group--error"));

        document.querySelectorAll(".nhsuk-error-message")
            .forEach(el => el.remove());
    }

});