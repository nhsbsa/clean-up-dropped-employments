document.addEventListener('DOMContentLoaded', function () {

    const tableBody = document.querySelector('#reportTable tbody');
    const addButton = document.getElementById('addRowButton');
    const form = document.getElementById('reportForm');
    const errorSummary = document.getElementById('errorSummary');
    const errorList = document.getElementById('errorList');

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
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-visually-hidden" for="sets-${rowCount}">
            Sets row ${rowCount}
            </label>
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="sets-${rowCount}"
                    name="sets[]"
                    type="text">
        </div>
        </td>
    
        <td class="nhsuk-table__cell">
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-visually-hidden" for="fields-${rowCount}">
            Fields row ${rowCount}
            </label>
            <input class="nhsuk-input nhsuk-input--width-10 nhsuk-u-font-size-14"
                    id="fields-${rowCount}"
                    name="fields[]"
                    type="text">
        </div>
        </td>
    
        <td class="nhsuk-table__cell">
        <div class="nhsuk-form-group">
            <label class="nhsuk-label nhsuk-u-visually-hidden" for="amendments-${rowCount}">
            Amendments row ${rowCount}
            </label>
            <input class="nhsuk-input nhsuk-u-font-size-14"
                    id="amendments-${rowCount}"
                    name="amendments[]"
                    type="text">
        </div>
        </td>
    
        <td class="nhsuk-table__cell">
        <div class="nhsuk-form-group">
        <label class="nhsuk-label nhsuk-u-visually-hidden" for="amendments-${rowCount}">
            Reason row ${rowCount}
        </label>
        <input class="nhsuk-input nhsuk-u-font-size-14"
                id="reason-${rowCount}"
                name="reason[]"
                type="text">
        </div>
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

    function validateField(input, message, errorsArray) {

        if (input.value.trim() === '') {

            const formGroup = input.closest('.nhsuk-form-group');

            formGroup.classList.add('nhsuk-form-group--error');
            input.classList.add('nhsuk-input--error');

            const errorId = input.id + "-error";

            const errorMessage = document.createElement('span');
            errorMessage.className = "nhsuk-error-message  nhsuk-u-font-size-14";
            errorMessage.id = errorId;
            errorMessage.innerHTML =
                '<span class="nhsuk-u-visually-hidden">Error:</span> ' + message;

            formGroup.insertBefore(errorMessage, input);

            input.setAttribute('aria-describedby', errorId);

            errorsArray.push({
                input: input,
                summaryText: message
            });
        }
    }



    // Form validation
    form.addEventListener('submit', function (e) {

        const rows = Array.from(tableBody.querySelectorAll('tr'));
        let errors = [];

        errorList.innerHTML = '';
        errorSummary.style.display = 'none';

        // Clear previous errors
        tableBody.querySelectorAll('.nhsuk-form-group').forEach(group => {
            group.classList.remove('nhsuk-form-group--error');

            const errorMessage = group.querySelector('.nhsuk-error-message');
            if (errorMessage) errorMessage.remove();

            const input = group.querySelector('input');
            input.classList.remove('nhsuk-input--error');
            input.removeAttribute('aria-describedby');
        });

        rows.forEach((row, index) => {

            const setsInput = row.querySelector('input[name="sets[]"]');
            const fieldsInput = row.querySelector('input[name="fields[]"]');
            const amendmentsInput = row.querySelector('input[name="amendments[]"]');

            const allEmpty = [setsInput, fieldsInput, amendmentsInput]
                .every(input => input.value.trim() === '');

            if (allEmpty) {
                row.remove();
                return;
            }

            validateField(setsInput, "Enter the sets", errors);
            validateField(fieldsInput, "Enter the fields", errors);
            validateField(amendmentsInput, "Enter amendments", errors);

        });

        if (errors.length > 0) {
            e.preventDefault();

            errors.forEach(err => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = "#" + err.input.id;
                a.textContent = err.summaryText;
                li.appendChild(a);
                errorList.appendChild(li);
            });

            errorSummary.style.display = 'block';
            errorSummary.focus();
        }

    });


});