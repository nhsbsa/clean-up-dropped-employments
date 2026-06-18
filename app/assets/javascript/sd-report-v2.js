document.addEventListener('DOMContentLoaded', function () {

    const tableBody = document.querySelector('#reportTable tbody');
    const addButton = document.getElementById('addRowButton');
    const undoContainer = document.querySelector('.undoRemovalContainer');
    const undoButton = document.getElementById('undoRemovalButton');

    let lastRemovedRow = null;
    let lastRemovedIndex = null;

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
    
        // Get amendment text before removing row
        const amendmentField = row.querySelector('textarea[name="amendments[]"]');
        const amendmentText = amendmentField ? amendmentField.value : '';
    
        // Store row and its original position
        lastRemovedRow = row;
        lastRemovedIndex = Array.from(tableBody.children).indexOf(row);
    
        row.remove();
    
        removedAmendmentText.textContent = amendmentText;
        undoContainer.hidden = false;
        undoContainer.classList.add("undoContainerVisible");
    }

    undoButton.addEventListener('click', function () {

        if (!lastRemovedRow) {
            return;
        }
    
        const rows = tableBody.children;
    
        // Put row back in its original position
        if (lastRemovedIndex >= rows.length) {
            tableBody.appendChild(lastRemovedRow);
        } else {
            tableBody.insertBefore(lastRemovedRow, rows[lastRemovedIndex]);
        }
    
        lastRemovedRow = null;
        lastRemovedIndex = null;
    
        undoContainer.hidden = true;
        undoContainer.classList.remove("undoContainerVisible");
    
        bindRemoveLinks();
    });

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
            <textarea rows="1" class="nhsuk-textarea nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"></textarea>
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


        // =========================
        // DESCRIPTION VALIDATION
        // =========================

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

        // =========================
        // REASON TEXTAREA VALIDATION
        // =========================

        const reasonGroup = document.getElementById("issueReason");
        const reasonTextarea = document.getElementById("issue-reason");

        if (!reasonTextarea.value.trim()) {

            const message =
                '<span class="nhsuk-u-visually-hidden">Error:</span>Enter the reason why you require an update for this record';

            // add NHS error styling
            reasonGroup.classList.add("nhsuk-form-group--error");
            reasonTextarea.classList.add("nhsuk-textarea--error");

            // create error message if it doesn't exist
            let error = document.getElementById("issue-reason-error");

            if (!error) {
                error = document.createElement("span");
                error.id = "issue-reason-error";
                error.className = "nhsuk-error-message";
                error.innerHTML = message;

                reasonTextarea.parentNode.insertBefore(error, reasonTextarea);
            }

            // ensure correct message text
            error.innerHTML = message;

            // accessibility
            reasonTextarea.setAttribute(
                "aria-describedby",
                "issue-reason-error"
            );

            // add to summary
            errors.push(
                `<li><a href="#issue-reason">Enter the reason why you require an update for this record</a></li>`
            );

            // focus first invalid field
            if (!firstErrorField) {
                firstErrorField = reasonTextarea;
            }
        }

        // =========================
        // STANDARD FORM FIELDS VALIDATION
        // =========================

        const memberError = validateRequiredField({
            inputId: "membershipNumber",
            groupId: "membershipNumberGroup",
            errorId: "membershipNumber-error",
            message: "Enter the member number",
            errors
        });

        if (!firstErrorField && memberError) {
            firstErrorField = memberError;
        }

        const initialError = validateRequiredField({
            inputId: "memberFirstInitial",
            groupId: "memberFirstInitialGroup",
            errorId: "memberFirstInitial-error",
            message: "Enter the members first initial",
            errors
        });

        if (!firstErrorField && initialError) {
            firstErrorField = initialError;
        }

        const surnameError = validateRequiredField({
            inputId: "memberSurname",
            groupId: "memberSurnameGroup",
            errorId: "memberSurname-error",
            message: "Enter the members surname",
            errors
        });

        if (!firstErrorField && surnameError) {
            firstErrorField = surnameError;
        }

        const recordTypeChangeError = validateRadioGroup({
            name: "recordTypeChange",
            groupId: "recordTypeChangeGroup",
            errorId: "recordTypeChange-error",
            message: "Select a type of change",
            errors
        });
        
        if (!firstErrorField && recordTypeChangeError) {
            firstErrorField = recordTypeChangeError;
        }

        const corruptedError = validateRadioGroup({
            name: "corrupted",
            groupId: "corruptedGroup",
            errorId: "corrupted-error",
            message: "Select yes if your file has been corrupted",
            errors
        });
        
        if (!firstErrorField && corruptedError) {
            firstErrorField = corruptedError;
        }

        const paymentError = validateRadioGroup({
            name: "payment",
            groupId: "paymentGroup",
            errorId: "payment-error",
            message: "Select yes if payment will be affected",
            errors
        });
        
        if (!firstErrorField && paymentError) {
            firstErrorField = paymentError;
        }

        const siteAutoError = validateRequiredField({
            inputId: "siteAuto",
            groupId: "siteAutoGroup",
            errorId: "siteAuto-error",
            message: "Enter the site you are based at",
            errors
        });

        if (!firstErrorField && siteAutoError) {
            firstErrorField = siteAutoError;
        }
        
        const directorateError = validateRequiredField({
            inputId: "directorate",
            groupId: "directorateGroup",
            errorId: "directorate-error",
            message: "Enter your directorate",
            errors
        });

        if (!firstErrorField && directorateError) {
            firstErrorField = directorateError;
        }

        if (errors.length > 0) {
            errorList.innerHTML = errors.join("");
            errorSummary.style.display = "block";

            errorSummary.scrollIntoView({ behavior: "smooth" });

            return;
        }

        form.submit();
    });

    // =========================
    // HELPERS
    // =========================

    function getRowInputs(row) {
        return [
            row.querySelector('input[name="sets[]"]'),
            row.querySelector('input[name="fields[]"]'),
            row.querySelector('textarea[name="amendments[]"]'),
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

    // Helper for the text field validation
    function validateRequiredField({
        inputId,
        groupId,
        errorId,
        message,
        errors
    }) {
    
        const input = document.getElementById(inputId);
        const group = document.getElementById(groupId);
    
        if (!input.value.trim()) {
    
            const errorMessage =
                `<span class="nhsuk-u-visually-hidden">Error:</span> ${message}`;
    
            group.classList.add("nhsuk-form-group--error");
            input.classList.add("nhsuk-input--error");
    
            let error = document.getElementById(errorId);

            const formGroup = input.closest('.nhsuk-form-group');
            const label = formGroup?.querySelector('.nhsuk-label');

            if (!error) {
                error = document.createElement("span");
                error.id = errorId;
                error.className = "nhsuk-error-message";

                label.insertAdjacentElement('afterend', error);
            }
    
            error.innerHTML = errorMessage;
    
            input.setAttribute("aria-describedby", errorId);
    
            errors.push(
                `<li><a href="#${inputId}">${message}</a></li>`
            );
    
            return input;
        }
    }

    // Helper for the radio button validation
    function validateRadioGroup({
        name,
        groupId,
        errorId,
        message,
        errors
    }) {
    
        const radios = document.querySelectorAll(
            `input[name="${name}"]`
        );
    
        const group = document.getElementById(groupId);
    
        const checked = [...radios].some(radio => radio.checked);
    
        if (!checked) {
    
            const errorMessage =
                `<span class="nhsuk-u-visually-hidden">Error:</span> ${message}`;
    
            group.classList.add("nhsuk-form-group--error");
    
            let error = document.getElementById(errorId);
    
            if (!error) {
    
                error = document.createElement("span");
    
                error.id = errorId;
                error.className = "nhsuk-error-message";
                error.innerHTML = errorMessage;

                const fieldset = group.querySelector(".nhsuk-fieldset");
                const radios = fieldset.querySelector(".nhsuk-radios");
            
                fieldset.insertBefore(error, radios);
            }
    
            errors.push(
                `<li><a href="#${radios[0].id}">${message}</a></li>`
            );
    
            radios[0].setAttribute(
                "aria-describedby",
                errorId
            );
    
            return radios[0];
        }
    
        return null;
    }

    function clearErrors() {
        errorList.innerHTML = "";
        errorSummary.style.display = "none";

        document.querySelectorAll(".nhsuk-form-group--error, .nhsuk-textarea--error, .nhsuk-input--error")
            .forEach(el => el.classList.remove("nhsuk-form-group--error", "nhsuk-textarea--error", "nhsuk-input--error"));

        // remove table-generated errors only
        document.querySelectorAll("td .nhsuk-error-message")
            .forEach(el => el.remove());

        [
            "membershipNumber-error",
            "memberFirstInitial-error",
            "memberSurname-error",
            "recordTypeChange-error",
            "siteName-error",
            "directorate-error"
        ].forEach(id => {
            const el = document.getElementById(id);
        
            if (el) {
                el.remove();
            }
        });

        // remove textarea error message text
        const reasonError = document.getElementById("issue-reason-error");

        if (reasonError) {
        reasonError.innerHTML = "";
        }
    }

});